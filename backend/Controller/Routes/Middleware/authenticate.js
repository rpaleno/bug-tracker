const jwt = require('jsonwebtoken')

//authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.send('no token')
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403)
        req.id = decoded.UserInfo.id
        req.name = decoded.UserInfo.name
        req.role = decoded.UserInfo.role
        next();
    })
}

module.exports = authenticateToken;