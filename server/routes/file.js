// const express = require("express")
// const router = express.Router()
// const userJWT = require("../middleware/userJWT")
// const manager = require("../middleware/managerMiddleware")
// const fileController=require("../controllers/fileController")

// router.post("/addTask",userJWT,manager,fileController.addTask)
// router.get("/downloadFile/:fileName",userJWT,fileController.downloadFile)

// module.exports=router

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');
const manager = require("../middleware/managerMiddleware")
const userJWT = require("../middleware/userJWT")
const client = require("../middleware/clientMiddleware")

// הגדרת אחסון הקבצים
const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

router.post('/addTask',upload.single('file'), fileController.addTask);
router.get('/files/:fileName',fileController.viewFile);
router.get('/download/:fileName',fileController.downloadFile);
module.exports = router;
