const User = require("../models/User");
const Organizer = require("../models/Organizer");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const addOrganizer = async (req, res) => {
    const { name, userId, password, email, address, phone,profession} = req.body
    const userIdExist = await User.findOne({ userId: userId }).lean()
    if (userIdExist) {
        return res.status(400).send("userId exists")
    }
    if (!name || !userId || !password || !email) {
        return res.status(400).send("name and userId and email and password are required")
    }
    const newPass = await bcrypt.hash(password, 10)
    const user = await User.create({ name, userId, role: "organizer", password: newPass });
    if (!user) {
        return res.status(400).send("user not created")
    }
    const userIdRef = user._id.toString()
    const organizer = await Organizer.create({ address, email, phone, userIdRef,profession });
    if (!organizer) {
        return res.status(400).send("organizer not created")
    }
    const newUser = { _id: user._id.toString(), name: user.name, userId: user.userId }
    const accessToken = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken, role: user.role })
}

const updateOrganizer = async (req, res) => {
    const { id, name, userId, password, email, address, phone,profession } = req.body
    if (!id || !name || !userId || !password || !email) {
        return res.status(400).send("id and name and userId and password and email are required")
    }

    const organizer = await Organizer.findById(id).exec();
    if (!organizer) {
        return res.status(400).send("organizer not found")
    }

    const userIdExist = await User.findOne({ userId: userId }).lean()
    if (userIdExist && userIdExist._id.toString() != organizer.userIdRef.toString()) {
        return res.status(400).send("userId exist")
    }

    const user = await User.findById(organizer.userIdRef).exec();
    if (!user) {
        return res.status(400).send("user not found")
    }

    user.name = name
    user.userId = userId
    organizer.email = email
    organizer.address = address
    organizer.phone = phone
    const newPass = await bcrypt.hash(password, 10)
    user.password = newPass
    organizer.profession=profession

    const newUser = await user.save()
    const newOrganizer = await Organizer.save()

    res.send("organizer updated")
}

const getOrganizer= async (req,res) => {
    const { userId } = req.params
    const user = await User.findOne({ userId: userId }).lean();

    if (!user) {
        return res.status(400).send("user not found")

    }
    const organizer = await Organizer.findOne({ userIdRef: user._id.toString()}).lean();

    if (!organizer)
        return res.status(400).send("organizer not found")

    res.json({ user, organizer })
}
module.exports = {
    addOrganizer,
    updateOrganizer,
    getOrganizer
}