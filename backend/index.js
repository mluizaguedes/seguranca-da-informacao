require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { sendEmail } = require('./notifications');
const User = require('./models/User');
const Incident = require('./models/Incident');

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
}));

app.use(express.json());

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// Rota para criar incidente, notificar usuários e gerar backup
app.post('/incident', async (req, res) => {
  try {
    const { description = 'Incidente desconhecido' } = req.body;

    const incident = new Incident({ description });
    await incident.save();

    const users = await User.find();

    for (let u of users) {
      await sendEmail(
        u.email,
        'Notificação de Segurança - LGPD',
        `Olá ${u.name},\n\nDetectamos: ${description}\nData: ${incident.timestamp}\n`
      );

      incident.notifications.push({
        userId: u._id,
        email: u.email,
        sentAt: new Date()
      });
    }

    await incident.save();

    // Backup automático
    const backupData = {
      backupAt: new Date(),
      users: await User.find(),
      incidents: await Incident.find()
    };

    const backupFilePath = path.join(__dirname, 'backup.json');
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

    console.log('✅ Backup salvo em:', backupFilePath);

    res.status(201).json({ 
      status: 'ok', 
      message: 'Incidente registrado, usuários notificados e backup gerado.',
      incidentId: incident._id,
      backupFile: backupFilePath
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Visualizar backup
app.get('/backup', (req, res) => {
  const backupFilePath = path.join(__dirname, 'backup.json');
  if (fs.existsSync(backupFilePath)) {
    res.sendFile(backupFilePath);
  } else {
    res.status(404).json({ error: 'Backup não encontrado' });
  }
});

// Ver logs de notificações
app.get('/logs', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ 'notifications.sentAt': -1 });
    const result = [];
    incidents.forEach(inc => {
      inc.notifications.forEach(n => {
        result.push({
          incidentId: inc._id,
          description: inc.description,
          email: n.email,
          sentAt: n.sentAt
        });
      });
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Cadastro de usuário
app.post('/register', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    const user = new User({ name, email });
    await user.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server rodando na porta ${PORT}`));
