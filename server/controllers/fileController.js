
// const fs = require("fs");

// const downloadFile= (req, res) => {
//     const fileName = req.params.fileName;
//     const filePath = path.join(__dirname, 'uploads', fileName);

//     // בדיקה אם הקובץ קיים
//     if (fs.existsSync(filePath)) {
//         res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//         res.download(filePath, (err) => {
//             if (err) {
//                 console.error('Error downloading file:', err);
//                 res.status(500).send('Error downloading file');
//             }
//         });
//     } else {
//         res.status(404).send('File not found');
//     }
// }

// const addTask = async (req, res) => {
//     const { title, description, managerId, clientId, projectId, date } = req.body;

//     if (!title || !date || !managerId || !clientId || !projectId) {
//         return res.status(400).send("title, connectionId and date are required");
//     }

//     let fileExist = null;
//     let fileData = null;

//     if (req.file) {
//         fileData = {
//             fileName: req.file.originalname,
//             filePath: req.file.path,
//             fileSize: req.file.size,
//             fileType: req.file.mimetype
//         };

//         fileExist = await File.findOne(fileData).lean();

//         if (!fileExist) {
//             fileExist = await File.create(fileData);
//             if (!fileExist) {
//                 return res.status(400).send("file not created");
//             }
//         }
//     }

//     const connection = await Connection.findOne({ clientId, managerId, projectId }).lean();
//     if (!connection) {
//         return res.status(400).send("connection not found");
//     }

//     const task = await Task.create({
//         title,
//         description,
//         connectionId: connection._id.toString(),
//         date,
//         file: fileExist ? fileExist._id : null
//     });

//     if (!task) {
//         return res.status(400).send("task not created");
//     }

//     const tasks = await Task.find({ connectionId: connection._id }).populate("file").lean();
//     res.json(tasks);
// };

// module.exports = { addTask,downloadFile }
const path = require("path");
const fs = require("fs");
const File = require("../models/File");
const Task = require("../models/Task");
const Connection = require("../models/Connection");
const { log } = require("console");

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
            if (!fileExist) return res.status(400).send("file not created");
        }
    }

    const connection = await Connection.findOne({ clientId, managerId, projectId }).lean();
    if (!connection) return res.status(400).send("connection not found");

    const task = await Task.create({
        title,
        description,
        connectionId: connection._id.toString(),
        date,
        file: fileExist ? fileExist._id : null
    });

    if (!task) return res.status(400).send("task not created");

    const tasks = await Task.find({ connectionId: connection._id }).populate("file").lean();
    res.json(tasks);
};

const viewFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found");
    }
};

const downloadFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
    
    if (fs.existsSync(filePath)) {
        
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.download(filePath, (err) => {
            if (err) {
                
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } else {
        res.status(404).send('File not found');
    }
};

module.exports = { addTask, viewFile, downloadFile };
