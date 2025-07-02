const User = require('../models/User');

async function isAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Acesso restrito ao administrador.' });
    }
    next();
  } catch (err) {
    console.error('Erro no middleware isAdmin:', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
}

module.exports = isAdmin;