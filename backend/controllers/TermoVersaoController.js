const express = require('express');

const User = require('../models/User');
const TermoVersao = require('../models/TermoVersao');
const HistoricoLog = require('../models/HistoricoLog'); 

const auth = require('../middleware/auth');
const router = express.Router();

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Acesso restrito ao administrador." });
  }
  next();
};

router.post('/termos', auth, isAdmin, async (req, res) => {
  try {
    const { versao, termos } = req.body;

    if (!versao || !Array.isArray(termos) || termos.length === 0) {
      return res.status(400).json({ error: 'Versão e termos são obrigatórios.' });
    }

    const jaExiste = await TermoVersao.findOne({ versao });
    if (jaExiste) {
      return res.status(409).json({ error: 'Versão já existente.' });
    }

    const termosAgrupados = {
      obrigatorio: [],
      optIn: [],
      optOut: [],
    };

    for (const termo of termos) {
      if (!termo.tipo || !termo.titulo || !termo.descricao || !termo.id) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios para cada termo.' });
      }

      if (!termosAgrupados[termo.tipo]) {
        return res.status(400).json({ error: `Tipo inválido: ${termo.tipo}` });
      }

      termosAgrupados[termo.tipo].push({
        id: termo.id,
        titulo: termo.titulo,
        descricao: termo.descricao,
        tipo: termo.tipo,
      });
    }

    const todosTermos = [
      ...termosAgrupados.obrigatorio,
      ...termosAgrupados.optIn,
      ...termosAgrupados.optOut,
    ];

    const novaVersao = new TermoVersao({
      versao,
      criadoPor: req.userId,
      termos: todosTermos,
    });

    await novaVersao.save();

    await HistoricoLog.create({
      userId: req.userId,
      acao: 'TERMO_VERSAO_CRIADA',
      origem: 'painel_admin',
      detalhes: {
        versao,
        termos: termosAgrupados,
      }
    });

    res.status(201).json({ message: 'Nova versão criada com sucesso.' });
  } catch (err) {
    console.error('Erro ao criar nova versão:', err);
    res.status(500).json({ error: 'Erro ao criar nova versão' });
  }
});

router.get("/termos/versao-atual", async (req, res) => {
  try {
    const ultimaVersao = await TermoVersao.findOne().sort({ publicadoEm: -1 });

    if (!ultimaVersao) {
      return res.status(404).json({ error: "Nenhuma versão de termos encontrada." });
    }

    const agrupados = {
      obrigatorio: [],
      optin: [],
      optout: [],
    };

    ultimaVersao.termos.forEach((termo) => {
      const tipo = termo.tipo.toLowerCase();
      if (agrupados[tipo]) {
        agrupados[tipo].push(termo);
      }
    });

    res.json({
      versao: ultimaVersao.versao,
      publicadoEm: ultimaVersao.publicadoEm,
      termos: agrupados,
    });

  } catch (err) {
    console.error("Erro ao buscar versão atual dos termos:", err);
    res.status(500).json({ error: "Erro interno ao buscar termos" });
  }
});

router.get('/termos/versoes', auth, isAdmin, async (req, res) => {
  try {
    const versoes = await TermoVersao.find()
      .sort({ publicadoEm: -1, createdAt: -1 })
      .select('versao publicadoEm termos criadoPor createdAt') 
      .populate('criadoPor', 'nome email'); 

    res.json(versoes);
  } catch (err) {
    console.error('Erro ao listar versões:', err);
    res.status(500).json({ error: 'Erro ao listar versões' });
  }
});

module.exports = router;