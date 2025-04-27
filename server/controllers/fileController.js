// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const Task = require('../models/Task')
// const File = require('../models/File')

// const addFile = async (file) => {

//     const fileName = file.fileName
//     const filePath = file.filePath
//     const fileSize = file.fileSize
//     const fileType = file.fileType

//     if (!fileName || !filePath || !fileSize || !fileType) {
//         return "fileName and filePath and fileSize and fileType are required"
//     }

//     let fileExist = await File.findOne(file).lean()
//     if (!fileExist) {
//         fileExist = await File.create(file);
//         if (!fileExist) {
//             return "file not created"
//         }
//     }
//     return fileExist
// }

// const getFile = async (id) => {

//     const file = await File.findById(id).lean();
//     if (!file)
//         return "file not found"
//     return file
// }

// const deleteFile = async (id) => {
//     // const { id } = req.params
    
//     if (!id) {
//         return "id is required"
//     }

//     const tasks = await Task.find({ fileId: id }).lean
//     if (!tasks) {
//         return "tasks not found"
//     }

//     if (tasks.length > 1) {
//         return "file didnt delete because it exists in more tasks"
//     }

//     const file = await File.findById(id).exec();
//     if (!file) {
//         return "file not found"
//     }

//     const result = await file.deleteOne()
//     if (!result) {
//         return "file not deleted"
//     }
//     return result
// }

// module.exports = { addFile, getFile, deleteFile }
// const multer = require("multer");
// const path = require("path");

// // הגדרת אחסון הקבצים
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // שמירה בתיקיית uploads
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // שם ייחודי
//     }
// });

// const upload = multer({ storage });

// module.exports = upload;

const addTask = async (req, res) => {
    const { title, description, managerId, clientId, projectId, date } = req.body;

    if (!title || !date || !managerId || !clientId || !projectId) {
        return res.status(400).send("title, connectionId and date are required");
    }

    let fileExist = null;
    let fileData = null;

    if (req.file) {
        fileData = {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            fileType: req.file.mimetype
        };

        fileExist = await File.findOne(fileData).lean();

        if (!fileExist) {
            fileExist = await File.create(fileData);
            if (!fileExist) {
                return res.status(400).send("file not created");
            }
        }
    }

    const connection = await Connection.findOne({ clientId, managerId, projectId }).lean();
    if (!connection) {
        return res.status(400).send("connection not found");
    }

    const task = await Task.create({
        title,
        description,
        connectionId: connection._id.toString(),
        date,
        file: fileExist ? fileExist._id : null
    });

    if (!task) {
        return res.status(400).send("task not created");
    }

    const tasks = await Task.find({ connectionId: connection._id }).populate("file").lean();
    res.json(tasks);
};
