const Task = require("../models/Task");
const Receiver = require("../models/Receiver");

//create
const addTask= async (req, res) => {
    const { title, description,receiverId,amount,date } = req.body

    if (!title || !receiverId ||!amount ||!date) {
        return res.status(400).send("tite and receiverId and amount and date are required")
    }

    const receiver = await Receiver.findById(receiverId).lean()
    if (!receiver) {
        return res.status(400).send("receiver not found")
    }
    const task = await Task.create({title,description,receiverId,amount,date });
    
    const tasks=await Task.find({date:date}).lean();
    
    if(!tasks){
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

//read
const getTask= async (req, res) => {
    const { id } = req.params

    const task = await Task.findById(id).lean();
    if (!task)
        return res.status(400).send("task not found")
    res.json(task)
}

const getTasks= async (req, res) => {

    const {date,receiverId}=req.body
    if(!date ||!receiverId){
        return res.status(400).send("date and receiverId are required")
    }

    const tasks = await Task.find({receiverId,date}).lean();
    if (!tasks)
        return res.status(400).send("tasks not found")
    res.json(tasks)
}

const updateTask= async (req, res) => {
    const { id, title, description,amount,date } = req.body

    if (!title || !id  ||!amount ||!date ) {
        return res.status(400).send("title and id and amount and date and kidId are required")
    }

    const task = await Task.findById(id).exec();
    if (!task) {
        return res.status(400).send("task not found")
    }

    task.title = title
    task.description = description
    task.amount = amount
    task.date = date

    const newTask = await task.save()

    const tasks = await Task.find({receiverId:task.receiverId,date}).lean();
    if(!tasks){
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}
const completeTask= async (req, res) => {
    const { id,completed, difficulty,comment } = req.body

    if ( !id   ||!completed ||! difficulty) {
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

    const tasks = await Task.find({receiverId:task.receiverId,date:task.date}).lean();
    if(!tasks){
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

//delete
const deleteTask= async (req, res) => {
    const { id } = req.params
    if (!id ) {
        return res.status(400).send("id is required")
    }
    const task = await Task.findById(id).exec();
    if (!task) {
        return res.status(400).send("task not found")
    }
    const result = await task.deleteOne()
    const tasks = await Task.find({receiverId:task.receiverId,date:task.date}).lean();
    if(!tasks){
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

module.exports = {
    addTask,
    getTask,
    getTasks,
    updateTask,
    deleteTask,
    completeTask
}