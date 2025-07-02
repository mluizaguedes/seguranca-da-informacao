const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/User');
const Curso = require('../models/Curso');
const Consentimento = require('../models/Consentimento');
const TermoVersao = require('../models/TermoVersao');
const HistoricoLog = require('../models/HistoricoLog');
const auth = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Rota de cadastro de usuário
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, dataNascimento, curso: cursoId, telefones = [], sexo, versao, respostas } = req.body;

    // Validações básicas
    if (!nome || !email || !senha || !cursoId) {
      return res.status(400).json({ error: 'Nome, email, senha e curso são obrigatórios' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }
    if (!mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({ error: 'ID de curso inválido' });
    }
    if (!(await Curso.findById(cursoId))) {
      return res.status(400).json({ error: 'Curso não encontrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashSenha = await bcrypt.hash(senha, salt);

    const telefonesMapeados = Array.isArray(telefones)
      ? telefones.filter(n => typeof n === 'string' && n.trim()).map(n => ({ numero: n.trim() }))
      : [];

    const user = new User({ nome, email, senha: hashSenha, dataNascimento, sexo, curso: cursoId, telefones: telefonesMapeados });

    if (sexo && sexo.trim() !== '') {
      user.sexo = sexo;
    }

    await user.save();

    // Incrementar contagem de alunos no curso
    await Curso.updateOne({ _id: cursoId }, { $inc: { totalAlunos: 1 } });

    let versaoAtual = null;

    if (versao) {
      versaoAtual = await TermoVersao.findOne({ versao });
      if (!versaoAtual) {
        return res.status(400).json({ error: "Versão de termos não encontrada." });
      }
    }

    if (versaoAtual) {
      const obrigatorios = versaoAtual.termos?.obrigatorio || [];
      const obrigatoriosNaoAceitos = obrigatorios.filter(t => !respostas[t.id]);

      if (obrigatoriosNaoAceitos.length > 0) {
        return res.status(400).json({ error: "Você deve aceitar todos os termos obrigatórios." });
      }

      await Consentimento.create({
        userId: user._id,
        versao,
        respostas: new Map(Object.entries(respostas)),
        isCurrent: true
      });

      await HistoricoLog.create({
        userId: user._id,
        acao: 'CONSENTIMENTO_ATUALIZADO',
        detalhes: { versao, respostas },
        origem: 'cadastro'
      });
    }

    // Responder
    const newUser = await User.findById(user._id)
      .populate('curso')
      .select('-senha');

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: newUser });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ error: 'Erro interno', detalhes: err.message });
  }
});

// Login de aluno
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }
    const aluno = await User.findOne({ email });
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado.' });
    const isMatch = await bcrypt.compare(senha, aluno.senha);
    if (!isMatch) return res.status(401).json({ error: 'Credenciais inválidas.' });

    // Gera token incluindo isAdmin
    const token = jwt.sign({ id: aluno._id, isAdmin: aluno.isAdmin }, JWT_SECRET, { expiresIn: '14d' });

    return res.status(200).json({ 
      token, 
      user: { 
        id: aluno._id, 
        nome: aluno.nome, 
        email: aluno.email, 
        isAdmin: aluno.isAdmin 
      } 
    });
  } catch (err) {
    console.error('Erro ao logar:', err);
    return res.status(500).json({ error: 'Não foi possível fazer o login.' });
  }
});

// Rota get de cursos
router.get('/cursos', async (req, res) => {
  try {
    const cursos = await Curso.find();
    return res.status(200).json(cursos);
  } catch (err) {
    console.error('Erro ao carregar cursos:', err);
    return res.status(500).json({ error: 'Não foi possível acessar os cursos.' });
  }
});

// Rota get de alunos
router.get('/alunos', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.curso && mongoose.Types.ObjectId.isValid(req.query.curso)) {
      filter.curso = req.query.curso;
    }
    if (req.query.email) {
      filter.email = req.query.email.toLowerCase();
    }
    const alunos = await User.find(filter)
      .populate('curso')
      .select('-senha');
    return res.status(200).json({ message: 'Alunos listados com sucesso', alunos });
  } catch (err) {
    console.error('Erro ao listar alunos:', err);
    return res.status(500).json({ error: 'Falha no servidor.' });
  }
});

// Rota get de alunos/me
router.get('/alunos/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.alunoId)
      .populate('curso')
      .select('-senha');
    if (!user) { return res.status(404).json({ error: 'Usuário não encontrado.' }); }
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota atualizar de alunos/me
router.put('/alunos/me', auth, async (req, res) => {
  try {
    const userId = req.alunoId;
    const { nome, dataNascimento, sexo, telefones = [], contatoEmergencia = {} } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    if (Array.isArray(telefones)) {
      user.telefones = telefones
        .filter(n => typeof n === 'string' && n.trim() !== '')
        .map(n => ({ numero: n.trim() }));
    }

    if (contatoEmergencia && typeof contatoEmergencia === 'object') {
      const { nome: ceNome, telefone: ceTel } = contatoEmergencia;
      if (ceNome || ceTel) {
        user.contatoEmergencia = {};
        if (ceNome && typeof ceNome === 'string') user.contatoEmergencia.nome = ceNome.trim();
        if (ceTel && typeof ceTel === 'string') user.contatoEmergencia.telefone = ceTel.trim();
      } else {
        user.contatoEmergencia = {};
      }
    }

    if (nome) user.nome = nome;
    if (dataNascimento) user.dataNascimento = dataNascimento;
    if (sexo) user.sexo = sexo;

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('curso')
      .select('-senha');

    return res.json({ user: updatedUser });
  } catch (err) {
    console.error('Erro na rota PUT /alunos/me:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;