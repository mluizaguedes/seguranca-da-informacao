require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { sendEmail } = require('./notifications');
const Incident = require('./models/Incident');
const { runBackup } = require('./backup');
const { restoreLatestBackup } = require('./restore');
const { cleanupOldBackups } = require('./cleanup');
const cors = require("cors");

const UserController = require("./controllers/UserController");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado");
    await atualizarCachePoliticas();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err.message);
    process.exit(1); 
  });

app.use("/", UserController);

async function handleIncident(description) {
  // 1. Registrar incidente
  const incident = new Incident({ description });
  await incident.save();

  // 2. Notificar usuários
  const users = await User.find();
  for (const u of users) {
    await sendEmail(u.email, '⚠️ Comunicado Urgente: Incidente de Segurança envolvendo seus dados', 
    `Prezado(a) ${u.name},

      Estamos entrando em contato para informar que, infelizmente, sofremos um incidente de segurança que resultou no acesso não autorizado aos nossos sistemas.

      Após investigação interna, identificamos que dados pessoais e sensíveis de nossos usuários foram expostos, incluindo, mas não se limitando a:
      - Nome completo
      - Endereço de e-mail
      - Informações de identificação (CPF, endereço, entre outros, caso cadastrados)
      - Dados de login e acesso ao sistema

      Lamentamos profundamente a situação e assumimos total responsabilidade pelo ocorrido. Imediatamente após a detecção do ataque, nossos sistemas executaram procedimentos automatizados de contenção, restauração do backup mais recente e reforço da segurança da aplicação.

      O que você deve fazer agora:
      1. Troque imediatamente sua senha de acesso à plataforma.
      2. Monitore seus e-mails e contas associadas.
      3. Desconfie de qualquer mensagem suspeita solicitando seus dados.
      4. Em caso de uso indevido das suas informações, nos comunique e registre um boletim de ocorrência.

      Nosso canal de atendimento está disponível para suporte:
      suporte@empresa.com.br | 0800 000 0000

      Pedimos desculpas pelo transtorno causado e reiteramos nosso compromisso com a transparência, responsabilidade e proteção dos seus dados.

      Atenciosamente,
      Equipe de Segurança da Informação`);
    
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