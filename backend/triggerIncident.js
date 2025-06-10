const axios = require('axios');

(async function(){
  console.log('🔄 Iniciando simulação de incidente...');
  try {
    await axios.post('http://localhost:3000/incident', { description: 'Simulação de ataque e recuperação' });
    console.log('✅ Incidente disparado e tratado.');
  } catch(err) {
    console.error('❌ Erro na simulação:', err.response?.data || err.message);
  }
})();