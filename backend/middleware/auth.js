const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

// o next é basicamente usado para dar continuidade
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado.' })
    }

    const token = authHeader.replace('Bearer ', '')

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.alunoId = decoded.id
        req.userId = decoded.id;
        return next()
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' })
    }
}

module.exports = auth