const Connection = require("../models/Connection");
const File = require("../models/File");
const Task = require("../models/Task");
const User = require("../models/User");

const addTask = async (req, res) => {
    const { title, description, managerId, clientId, projectId, date} = req.body
    const file=req.file
    if (!title || !date || !managerId || !clientId || !projectId) {
        return res.status(400).send("tite and connectionId and date are required")
    }
    let fileExist = null
    let fileData = null

    if (file) {
        fileData = {
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            fileType: file.mimetype
        };

        if (!file.originalname || !file.path || !file.size || !file.mimetype) {
            return res.status(400).send("fileName and filePath and fileSize and fileType are required")
        }

        fileExist = await File.findOne(fileData).lean()
        
        if (!fileExist) {
            
            fileExist = await File.create(fileData)
            if (!fileExist) {
                return res.status(400).send("file not created")
            }
        }
    }

    const connection = await Connection.findOne({ clientId, managerId, projectId }).lean()
    if (!connection) {
        return res.status(400).send("connection not found")
    }

    const task = await Task.create({ title, description, connectionId: connection._id.toString(), date, file: fileExist?._id });
    if (!task) {
        return res.status(400).send("task not created")
    }

    const tasks = await Task.find({ connectionId: connection._id }).populate("file").lean();
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }

    res.json(tasks)
}

const getTask = async (req, res) => {
    const { id } = req.params

    const task = await Task.findById(id).populate("file").lean();
    if (!task)
        return res.status(400).send("task not found")
    res.json(task)
}

// const getTasksManager = async (req, res) => {

//     const { connectionId } = req.body
//     if (!connectionId ) {
//         return res.status(400).send("connectionId is required")
//     }

//     const tasks = await Task.find({ connectionId }).lean();
//     if (!tasks)
//         return res.status(400).send("tasks not found")
//     res.json(tasks)
// }

const getTasks = async (req, res) => {
    // const { clientId } = req.params

    // if (!clientId) {
    //     return res.status(400).send("clientId is required")
    // }

    // const connections = await Connection.find({ clientId }).lean()
    // if (!connections) {
    //     return res.status(400).send("connections not found")
    // }

    // const allTasks = await Promise.all(connections.map(async (connection) => {
    //     return await Task.find({ connectionId: connection._id }).populate('connectionId').populate('file').lean();
    // }))
    // res.json(allTasks)
    const { clientId } = req.params;

    if (!clientId) {
        return res.status(400).send("clientId is required");
    }

    const connections = await Connection.find({ clientId }).lean();
    if (!connections.length) {
        return res.status(400).send("Connections not found");
    }
    
    const connectionIds = connections.map(c => c._id);    
    const allTasks = await Task.find({ connectionId: { $in: connectionIds } })
        .populate({path: "connectionId",populate: {path: "managerId"  }})
        .populate("file")
        .lean();

    res.json(allTasks);
}

const getTasksClient = async (req, res) => {

    const { projectId, managerId, clientId } = req.params
    if (!projectId || !clientId || !managerId) {
        return res.status(400).send("clientId and managerId and projectId are required")
    }

    const connection = await Connection.findOne({ projectId, managerId, clientId }).lean()
    if (!connection) {
        return res.status(400).send("connection not found")
    }

    const tasks = await Task.find({ connectionId: connection._id }).populate("file").lean();
    if (!tasks)
        return res.status(400).send("tasks not found")
    res.json(tasks)
}

const updateTask = async (req, res) => {
    const { id, title, description } = req.body
    const file=req.file
    if (!title || !id) {
        return res.status(400).send("title and id are required")
    }

    const task = await Task.findById(id).exec();
    if (!task) {
        return res.status(400).send("task not found")
    }

    /*delete old file*/
    let fileExist = null
    let fileData = null

    if (file) {
        fileData = {
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            fileType: file.mimetype
        };
        const tasks = await Task.find({ file: task.file }).lean()
        if (!tasks) {
            return res.status(400).send("tasks not found")
        }

        if (tasks.length === 1) {
            
            const deletefile = await File.findById(task.file ).exec();
            if (!deletefile) {
                return res.status(400).send("file not found")
            }

            const result = await deletefile.deleteOne()
            if (!result) {
                return res.status(400).send("file not deleted")
            }
        }

        if (!file.originalname || !file.path || !file.size || !file.mimetype) {
            return res.status(400).send("fileName and filePath and fileSize and fileType are required")
        }

        fileExist = await File.findOne(fileData).lean()
        if (!fileExist) {
            fileExist = await File.create(fileData);
            if (!fileExist) {
                return res.status(400).send("file not created")
            }
        }
    }
    /*delete old file*/

    task.title = title
    task.description = description
    task.file = fileExist?fileExist._id:null
    

    const newTask = await task.save()
    if (!newTask) {
        return res.status(400).send("task not updated")
    }

    const tasks = await Task.find({ connectionId: task.connectionId }).populate("file").lean();
    if (!tasks)
        return res.status(400).send("tasks not found")
    res.json(tasks)
}

const completeTask = async (req, res) => {
    const { id, completed, difficulty, comment,clientId } = req.body

    if (!id || !clientId) {
        return res.status(400).send("id and clientId are required")
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

    
    const connections = await Connection.find({ clientId }).lean();
    if (!connections.length) {
        return res.status(400).send("Connections not found");
    }

    const connectionIds = connections.map(c => c._id);    
    const tasks = await Task.find({ connectionId: { $in: connectionIds } })
    .populate({path: "connectionId",populate: {path: "managerId"  }}).populate("file").lean();
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

    if (task.file) {
        const tasks = await Task.find({ file: task.file._id }).lean
        if (!tasks) {
            return res.status(400).send("tasks not found")
        }

        if (tasks.length === 1) {
            const file = await File.findById(task.file._id).exec();
            if (!file) {
                return res.status(400).send("file not found")
            }

            const result = await file.deleteOne()
            if (!result) {
                return res.status(400).send("file not deleted")
            }
        }
    }


    const result = await task.deleteOne()

    const tasks = await Task.find({ connectionId: task.connectionId }).populate("file").lean();
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

module.exports = {
    addTask,
    getTask,
    // getTasksManager,
    getTasksClient,
    updateTask,
    deleteTask,
    completeTask,
    getTasks
}