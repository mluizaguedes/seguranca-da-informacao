require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { sendEmail } = require('./notifications');
const User = require('./models/User');
const Incident = require('./models/Incident');
const { runBackup } = require('./backup');
const { restoreLatestBackup } = require('./restore');
const { cleanupOldBackups } = require('./cleanup');
const AuditLog = require('./models/AuditLog');
const Termos = require('./models/Termos');
const isAdmin = require('./middleware/isAdmin');

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
}));

app.use(express.json());

// Middleware de detecção de NoSQL injection
function payloadSuspeito(obj) {
  return Object.keys(obj).some(key =>
    key.startsWith('$') ||
    (typeof obj[key] === 'object' && payloadSuspeito(obj[key]))
  );
}

app.use((req, res, next) => {
  if (payloadSuspeito(req.body)) {
    handleIncident('Tentativa de Injeção NoSQL detectada').catch(console.error);
    return res.status(400).json({ error: 'Atividade maliciosa detectada.' });
  }
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(console.error);

async function handleIncident(description) {
  // 1. Registrar incidente
  const incident = new Incident({ description });
  await incident.save();

  // 2. Notificar usuários
  const users = await User.find();
  for (const u of users) {
    await sendEmail(u.email, '🚨 Incidente de Segurança',   
    `Olá ${u.name},

    Detectamos uma atividade maliciosa no sistema. Por precaução, restauramos seus dados com base no último backup confiável.

    Caso tenha dúvidas, entre em contato com a equipe técnica.

    Equipe de Segurança`);
    incident.notifications.push({ userId: u._id, email: u.email, sentAt: new Date() });
  }
  await incident.save();

  // 3. Restaurar o último backup
  try {
    const { restoredDir } = await restoreLatestBackup();
    console.log('✅ Restaurado backup:', restoredDir);
  } catch (err) {
    console.error('❌ Erro ao restaurar backup:', err);
  }

  // 4. Criar backup pós-incidente para análise futura
try {
    const { backupDir } = await runBackup();
    console.log('✅ Backup pós-incidente concluído em:', backupDir);
  } catch (err) {
    console.error('❌ Erro ao criar backup pós-incidente:', err);
  }
}

// Rota para disparar incidente manual
app.post('/incident', async (req, res) => {
  const { description = 'Incidente manual' } = req.body;
  try {
    await handleIncident(description);
    res.status(200).json({ message: 'Incidente tratado: restauração e backup executados.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/backup', async (req, res) => {
  try {
    await runBackup();
    res.status(200).json({ message: 'Backup executado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, data, cpf, curso, telefone, optInNews, optInShare, cookies } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    const user = new User({
      nome,
      email,
      senha,
      dataNascimento: data,
      cpf,
      curso,
      telefones: telefone, 
      optInNews,
      optInShare,
      cookies
    });

    await user.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });

  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err.message, err.stack);
    res.status(500).json({ error: 'Erro interno', detalhes: err.message });
  }
});

app.post("/api/consentimento", async (req, res) => {
  const { userId, consentimento, data } = req.body;

  try {
    await db.collection("consentimentos").insertOne({
      userId,
      consentimento,
      data: new Date(data)
    });

    // salvando o log de auditoria
    await AuditLog.create({
      userId,
      acao: "CONSENTIMENTO_ATUALIZADO",
      detalhes: consentimento,
      origem: "web"
    });

    res.status(200).send("Consentimento registrado com sucesso.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao salvar consentimento.");
  }
});

app.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ data: -1 }).populate('userId', 'nome email');
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar logs de auditoria' });
  }
});

app.get('/api/privacidade/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const logs = await AuditLog.find({ userId }).sort({ data: -1 });
    res.json(logs);
  } catch (err) {
    console.error('Erro ao buscar logs de privacidade:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico de consentimento' });
  }
});

// ROTAS PROTEGIDAS
app.get('/api/termos', async (req, res) => {
  try {
    const termos = await Termos.findOne().sort({ atualizadoEm: -1 });
    res.json(termos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar termos' });
  }
});

app.post('/api/termos', isAdmin, async (req, res) => {
  const { titulo, conteudo } = req.body;
  const termo = new Termos({ titulo, conteudo });
  
  await termo.save();
  res.status(201).json({ message: 'Termo salvo com sucesso.', termo });
});

app.put('/api/termos/:id', isAdmin, async (req, res) => {
  
  const { id } = req.params;
  const { titulo, conteudo } = req.body;

  try {
    const termo = await Termos.findByIdAndUpdate(
    id,
      { titulo, conteudo, ultimaAtualizacao: Date.now() },
      { new: true }
    );

    await AuditLog.create({
      userId: req.user._id, 
      acao: "TERMOS_ATUALIZADOS",
      detalhes: termo,
      origem: "painel_admin"
    });

    res.json({ message: 'Termos atualizados com sucesso', termo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar termos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server rodando na porta ${PORT}`));
