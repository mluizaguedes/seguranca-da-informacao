const User = require('../models/User');

module.exports = async function isAdmin(req, res, next) {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado: admin apenas' });
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao verificar admin' });
  }
};