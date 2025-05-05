const User = require("../models/User");
const Project = require("../models/Project");
const Connection = require("../models/Connection");
const ProjectToManager = require("../models/ProjectToManager");
const Task = require("../models/Task");
const bcrypt = require('bcrypt');
const { addProject } = require("./projectController");

const addClient = async (req, res) => {
    const { name, userId, password, address, phone, email, managerId, projectId } = req.body
    if (!name || !userId || !password || !phone || !managerId || !projectId) {
        return res.status(400).send("name and userId and managerId and projectId and password and phone and role are required")
    }
    const projectToManager = await ProjectToManager.findOne({ managerId, projectId }).lean()
    if (!projectToManager) {
        return res.status(400).send("project not found")
    }
    let user = await User.findOne({ userId, role: 'client' }).lean()

    if (user) {

        const client = await Connection.create({ projectId, managerId, clientId: user._id })

        if (!client) {
            return res.status(400).send("client not created")
        }
    } else {
        const newPass = await bcrypt.hash(password, 10)
        user = await User.create({ name, userId, password: newPass, address, phone, email, role: "client" })

        if (!user) {
            return res.status(400).send("user not created")
        }

        const client = await Connection.create({ projectId, managerId, clientId: user._id })

        if (!client) {
            return res.status(400).send("client not created")
        }
    }
    return res.json(user)
}

const addManager = async (req, res) => {
    const { name, userId, password, address, phone, email, projectName } = req.body

    if (!name || !userId || !password || !phone || !projectName) {
        return res.status(400).send("name and userId and password and projectName and phone are required")
    }

    const user = await User.findOne({ userId: userId, role: 'manager' }).lean()
    if (user) {
        return res.status(400).send("manager exists")
    }
    const newPass = await bcrypt.hash(password, 10)

    const manager = await User.create({ name, userId, password: newPass, address, phone, email, role: 'manager' })
    if (!manager) {
        return res.status(400).send("manager not created")
    }

    let projectExist = await Project.findOne({ name: projectName }).lean()
    if (!projectExist) {
        projectExist = await Project.create({ name: projectName });
        if (!projectExist) {
            return res.status(400).send("project not created")
        }

    }
    const projectToManager = await ProjectToManager.create({ projectId: projectExist._id, managerId: manager._id });

    if (!projectToManager) {
        return res.status(400).send("project not created")
    }

    return res.json(manager)
}

const getManagerClient = async (req, res) => {
    const { id } = req.params
    if(!id){
        return re.status(400).send("id is required")
    }
    const clients = await Connection.find({ managerId: id }).populate("clientId").populate("projectId").lean()
    if (!clients)
        return res.status(400).send("clients not found")
    res.json(clients)
}

const getClientManagers = async (req,res)=>{
    const { id } = req.params
    if(!id){
        return re.status(400).send("id is required")
    }
    const managers = await Connection.find({ clientId: id }).populate("managerId").populate("projectId").lean()
    if (!managers)
        return res.status(400).send("managers not found")
    res.json(managers)
}

const getUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).lean()
    if (!user) {
        return res.status(400).send("user not found")
    }
    res.json(user)
}

const getClient = async (req, res) => {
    const { id, projectId } = req.body
    const user = await User.findById(id).lean()
    if (!user) {
        return res.status(400).send("user not found")
    }
    const manager = await ProjectToManager.findOne({ projectId }).lean()
    if (!manager) {
        return res.status(400).send("manager not found")
    }
    const connection = await Connection.findOne({ clientId: id, managerId: manager.managerId.toString(), projectId: projectId }).lean()
    if (!connection) {
        return res.status(400).send("connection not found")
    }
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const tasks = await Task.find({ connectionId: connection._id, date: formattedDate }).lean()
    if (!tasks)
        return res.status(400).send("tasks not found")
    res.json(tasks)

}

const getProjectClients = async (req, res) => {

    const { projectId, managerId } = req.params


    if (!managerId || !projectId) {
        return res.status(400).send("managerId and projectId are required")
    }
    const clients = await Connection.find({ managerId: managerId, projectId: projectId }).populate("clientId").populate("projectId").lean();

    if (!clients) {
        return res.status(400).send("clients not found")
    }
    return res.json(clients)
}

const updateUser = async (req, res) => {
    const { id, name, address, phone, email } = req.body

    if (!id || !name || !phone || !email) {
        return res.status(400).send("id and name and phone and email are required")
    }
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).send("user not found")
    }
    user.name = name
    user.phone = phone
    user.address = address
    user.email = email

    const newUser = await user.save()
    if (!newUser) {
        return res.status(400).send("user not updated")
    }
    res.json(newUser)
}

const changePassword = async (req, res) => {
    const { id, password, newPassword } = req.body

    if (!id || !password) {
        return res.status(400).send("id  and password and newPassword are required")
    }
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).send("user not found")
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match)
        return res.status(400).send("password not correct")

    const newPass = await bcrypt.hash(newPassword, 10)
    user.password = newPass

    const newUser = await user.save()
    if (!newUser) {
        return res.status(400).send("user not updated")
    }
    res.json(newUser)
}

const deleteClient = async (req, res) => {

    const { id, managerId, projectId } = req.body

    if (!id || !managerId || !projectId) {
        return res.status(400).send("id and managerId and projectId are required")
    }

    const connection = await Connection.findOne({ managerId, projectId, clientId: id }).exec();
    if (!connection) {
        return res.status(400).send("connection not found")
    }

    const resultUser = await connection.deleteOne()
    if (!resultUser) {
        return res.status(400).send("user not deleted")
    }

    const user = await Connection.findOne({ clientId: id }).exec();
    if (!user) {

        const client = await User.findById(id).exec();
        if (!client) {
            return res.status(400).send("client not found")
        }

        const resultClient = await client.deleteOne()
        if (!resultClient) {
            return res.status(400).send("client not deleted")
        }

    }

    const deleteTask = await Task.deleteMany({ connectionId: connection._id }).exec()
    if (!deleteTask) {
        return res.status(400).send("tasks not deleted")
    }

    const clients = await Connection.find({ managerId }).populate("clientId").populate("projectId").lean();
    if (!clients) {
        return res.status(400).send("clients not found")
    }
    return res.json(clients)
}

const addImage = async (req, res) => {
    const { id, imageUrl } = req.body
    if (!imageUrl || !id) {
        return res.status(400).send("imageUrl and id are required")
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).send("user not found")
    }

    user.imageUrl = imageUrl

    const newUser = await user.save()
    if (!newUser) {
        return res.status(400).send("user not updated")
    }
    res.json(newUser)
}

module.exports = {
    addClient,
    addManager,
    getManagerClient,
    getClient,
    getProjectClients,
    updateUser,
    getUser,
    deleteClient,
    addImage,
    changePassword,
    getClientManagers
}