const User = require("../models/User");
const Receiver = require("../models/Receiver");
const Organizer = require("../models/Organizer");
const bcrypt = require('bcrypt')

const addReceiver = async (req, res) => {
    const { name, userId, password, organizerUserId, address, phone, email } = req.body
    if (!name || !userId || !password || !organizerUserId) {
        return res.status(400).send("name and userId and password and organizerUserId are required")
    }
    const userIdExist = await User.findOne({ userId: userId }).lean()

    if (userIdExist) {
        return res.status(400).send("userId exists")
    }
    const o_User = await User.findOne({ userId: organizerUserId }).lean()
    if (!o_User) {
        return res.status(400).send("o_User not found")
    }
    const o_organizer = await Organizer.findOne({ userIdRef: o_User._id.toString() }).lean()
    if (!o_organizer) {
        return res.status(400).send("o_organizer not found")
    }
    const newPass = await bcrypt.hash(password, 10)
    const user = await User.create({ name, userId, password, role: "receiver", password: newPass });
    if (!user) {
        return res.status(400).send("user not created")
    }
    const userIdRef = user._id.toString()
    const receiver = await Receiver.create({ address, phone, email, organizerId: o_organizer._id.toString(), userIdRef })
    if (!receiver) {
        return res.status(400).send("receiver not created")
    }
    const receivers = await Receiver.find({ organizerId: o_organizer._id.toString() }).lean();

    if (!receivers)
        return res.status(400).send("receivers not found")

    const users = await Promise.all(receivers.map(async (receiver) => {
        const user = await User.findById(receiver.userIdRef).lean()
        if (!user) {
            return res.status(400).send("user not found")
        }
        const obj = { receiver, user }
        return obj
    }))
    res.json(users)

}

const getReceiver = async (req, res) => {
    const { id } = req.params

    const receiver = await Receiver.findById(id).lean();
    if (!receiver) {
        return res.status(400).send("receiver not found")
    }
    const user = await User.findById(receiver.userIdRef).lean();
    if (!user)
        return res.status(400).send("user not found")

    res.json({ user, receiver })
}

const getReceivers = async (req, res) => {

    const { userId } = req.params
    const o_user = await User.findOne({ userId: userId }).lean()
    if (!o_user) {
        return res.status(400).send("o_user not found")
    }
    const organizer = await Organizer.findOne({ userIdRef: o_user._id.toString() })
    if (!organizer) {
        return res.status(400).send("organizer not found")
    }
    const receivers = await Receiver.find({ organizerId: organizer._id.toString() }).lean();
    if (!receivers)
        return res.status(400).send("receivers not found")
    const users = await Promise.all(receivers.map(async (receiver) => {
        const user = await User.findById(receiver.userIdRef).lean()
        if (!user) {
            return res.status(400).send("user not found")
        }
        const obj = { receiver, user }
        return obj
    }))
    console.log(users);
    res.json(users)
}

const updateReceiver = async (req, res) => {
    const { id, name, userId, password, address, phone, email } = req.body
    if (!id || !name || !userId || !password) {
        return res.status(400).send("id and name and userId and password are required")
    }

    const receiver = await Receiver.findById(id).exec();
    if (!receiver) {
        return res.status(400).send("receiver not found")
    }

    const userIdExist = await User.findOne({ userId: userId }).lean()
    if (userIdExist && userIdExist._id.toString() != receiver.userIdRef.toString()) {
        return res.status(400).send("userId exist")
    }

    const user = await User.findById(receiver.userIdRef).exec();
    if (!user) {
        return res.status(400).send("user not found")
    }
    user.name = name
    user.userId = userId
    receiver.phone = phone
    receiver.address = address
    receiver.email = email
    const newPass = await bcrypt.hash(password, 10)
    user.password = newPass

    const newUser = await user.save()
    const newReceicer = await receiver.save()

    const receivers = await Receiver.find({ organizerId: receiver.organizerId }).lean();

    if (!receivers)
        return res.status(400).send("receivers not found")
    const users = await Promise.all(receivers.map(async (receiver) => {
        const user = await User.findById(receiver.userIdRef).lean()
        if (!user) {
            return res.status(400).send("user not found")
        }
        const obj = { receiver, user }
        return obj
    }))
    res.json(users)
}

const deleteReceiver = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).send("id is required")
    }

    const receiver = await Receiver.findById(id).exec();
    if (!receiver) {
        return res.status(400).send("receiver not found")
    }

    const user = await User.findById(receiver.userIdRef).exec();
    if (!user) {
        return res.status(400).send("user not found")
    }

    const resultUser = await user.deleteOne()
    const resultReceiver = await receiver.deleteOne()
    const receivers = await Receiver.find({ organizerId: receiver.organizerId }).lean();
    if (!receivers) {
        return res.status(400).send("receivers not found")
    }
    const users = await Promise.all(receivers.map(async (receiver) => {
        const user = await User.findById(receiver.userIdRef).lean()
        if (!user) {
            return res.status(400).send("user not found")
        }
        const obj = { receiver, user }
        return obj
    }))
    res.json(users)
}

module.exports = {
    addReceiver,
    getReceiver,
    getReceivers,
    updateReceiver,
    deleteReceiver
}