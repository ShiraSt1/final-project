const Connection = require("../models/Connection");
const Task = require("../models/Task");
const User = require("../models/User");

const addTask = async (req, res) => {
    const { title, description,managerId,clientId,projectId, amount, date } = req.body
    if (!title || !amount || !date || !managerId || !clientId || !projectId ) {
        return res.status(400).send("tite and connectionId and amount and date are required")
    }

    const connection = await Connection.findOne({clientId,managerId,projectId}).lean()
    if (!connection) {
        return res.status(400).send("connection not found")
    }

    const task = await Task.create({ title, description,connectionId:connection._id.toString(), amount, date });
    if (!task) {
        return res.status(400).send("task not created")
    }
    const tasks = await Task.find({ connectionId:connection._id }).lean();
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }

    res.json(tasks)
}

const getTask = async (req, res) => {
    const { id } = req.params

    const task = await Task.findById(id).lean();
    if (!task)
        return res.status(400).send("task not found")
    res.json(task)
}


const getTasksManager = async (req, res) => {

    const { connectionId } = req.body
    if (!connectionId ) {
        return res.status(400).send("connectionId is required")
    }

    const tasks = await Task.find({ connectionId }).lean();
    if (!tasks)
        return res.status(400).send("tasks not found")
    res.json(tasks)
}

const getTasksClient = async (req, res) => {

    const { projectId,managerId, clientId } = req.params
    if (!projectId || !clientId ||!managerId) {
        return res.status(400).send("clientId and managerId and projectId are required")
    }

    const connection=await Connection.findOne({projectId,managerId, clientId}).lean()
    if(!connection){
        return res.status(400).send("connection not found")
    }

    const tasks = await Task.find({ connectionId:connection._id }).lean();
    if (!tasks)
        return res.status(400).send("tasks not found")
    res.json(tasks)
}

const updateTask = async (req, res) => {
    const { id, title, description, amount } = req.body
    if (!title || !id || !amount ) {
        return res.status(400).send("title and id and amount are required")
    }

    const task = await Task.findById(id).exec();
    if (!task) {
        return res.status(400).send("task not found")
    }

    task.title = title
    task.description = description
    task.amount = amount

    const newTask = await task.save()
    if (!newTask) {
        return res.status(400).send("task not updated")
    }

    const tasks = await Task.find({ connectionId: task.connectionId }).lean();
    if (!tasks)
        return res.status(400).send("tasks not found")
    res.json(tasks)
}

const completeTask = async (req, res) => {
    const { id, completed, difficulty, comment } = req.body

    if (!id || !completed || !difficulty) {
        return res.status(400).send("id and completed and difficulty are required")
    }
    const task = await Task.findById(id).exec();
    if (!task) {
        return res.status(400).send("task not found")
    }

    task.completed = completed
    task.difficulty = difficulty
    task.comment = comment

    const newTask = await task.save()
    if (!newTask) {
        return res.status(400).send("task not updated")
    }
    console.log(task.date);
    
    const tasks = await Task.find({ connectionId:task.connectionId, date: task.date }).lean();
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

const deleteTask = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).send("id is required")
    }
    const task = await Task.findById(id).exec();
    if (!task) {
        return res.status(400).send("task not found")
    }
    const result = await task.deleteOne()
    //////////////////////////////////////////
    // const tasks = await Task.find({ connectionId: task.connectionId, date: task.date}).lean();
    const tasks = await Task.find({ connectionId: task.connectionId}).lean();
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

module.exports = {
    addTask,
    getTask,
    getTasksManager,
    getTasksClient,
    updateTask,
    deleteTask,
    completeTask
}