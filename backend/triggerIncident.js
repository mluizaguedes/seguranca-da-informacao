const axios = require('axios');

async function triggerIncident() {
  try {
    const response = await axios.post('http://localhost:3000/incident', {
      description: '⚠️ Tentativa de invasão detectada'
    });

    console.log('✅ Incidente disparado com sucesso!');
    console.log(response.data);
  } catch (error) {
    console.error('❌ Erro ao disparar incidente:', error.response?.data || error.message);
  }
}

triggerIncident();
