const axios = require('axios');
const fs = require('fs');

async function triggerIncident() {
  try {
    console.log('⏳ Simulando Injeção NoSQL em /register...');

    const injResponse = await axios.post('http://localhost:3000/register', {
      name: { "$gt": "" }, // Payload típico de injeção NoSQL
      email: { "$gt": "" }
    });

    console.log('✅ Resposta Injeção:', injResponse.data);

  } catch (err) {
    console.log('🛑 Resultado da Injeção:', err.response?.data || err.message);
  }

  try {
  const backupResponse = await axios.get('http://localhost:3000/backup');
  console.log('Backup:', backupResponse.data);
} catch (error) {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (Buffer.isBuffer(data)) {
      console.error('❌ Erro ao tentar acessar o backup:', data.toString('utf-8'));
    } else {
      console.error('❌ Erro ao tentar acessar o backup:', data);
    }
  } else {
    console.error('❌ Erro ao tentar acessar o backup:', error.message);
  }
}

  try {
    console.log('⏳ Disparando um incidente de segurança...');

    const response = await axios.post('http://localhost:3000/incident', {
      description: '🚨 Simulação de tentativa de acesso indevido aos dados'
    });

    console.log('✅ Incidente disparado com sucesso!');
    console.log(response.data);
  } catch (error) {
    console.error('❌ Erro ao disparar incidente:', error.response?.data || error.message);
  }
}

triggerIncident();
