const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const { userId, password, role } = req.body
    if (!userId || !password || !role)
        return res.status(400).send("userId and role and password are required")
    const userIdExists = await User.findOne({ userId, role }).lean()
    if (!userIdExists)
        return res.status(400).send("userId doesn't exists")
    const match = await bcrypt.compare(password, userIdExists.password)
    if (!match)
        return res.status(400).send("password not correct")
    const newuser = { _id: userIdExists._id, name: userIdExists.name, userId: userIdExists.userId, role: userIdExists.role }
    const accessToken = jwt.sign(newuser, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken, id:userIdExists._id })
}

module.exports = { login }
