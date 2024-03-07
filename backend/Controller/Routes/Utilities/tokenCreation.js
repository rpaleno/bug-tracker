const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
    return jwt.sign({
        "UserInfo": {
            "id": user._id,
            "name": user.name,
            "email": user.email
        }
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

function generateRefreshToken(user) {
    return jwt.sign({"username": user.name}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = { generateAccessToken, generateRefreshToken }
