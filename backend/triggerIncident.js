// triggerIncident.js
const axios = require('axios');

async function triggerIncident() {
  try {
    const response = await axios.post('http://localhost:3000/incident', {
      description: 'Tentativa de invasão detectada'
    });
    console.log('Notificações enviadas:', response.data);
  } catch (error) {
    console.error('Erro ao enviar notificação:', error.response?.data || error.message);
  }
}

triggerIncident();
