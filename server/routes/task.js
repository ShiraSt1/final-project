const express = require("express")
const router = express.Router()
const taskController=require("../controllers/taskController")
const userJWT = require("../middleware/userJWT")
const upload = require('../middleware/upload'); 
const manager = require("../middleware/managerMiddleware")
const client = require("../middleware/clientMiddleware")

router.post("/addTask",userJWT, manager,upload.single('file') ,taskController.addTask)
// router.get("/getTask/:id",userJWT,taskController.getTask)
router.get("/getTasksClient/:managerId/:projectId/:clientId",userJWT,manager,taskController.getTasksClient)
router.get("/getAllManagerTasks/:managerId",userJWT,manager,taskController.getAllManagerTasks)
router.get("/getTasks/:clientId",userJWT,client,taskController.getTasks)
router.put("/completeTask",userJWT,client,taskController.completeTask)
router.put("/updateTask",userJWT,manager, upload.single('file'),taskController.updateTask)
router.delete("/deleteTask/:id",userJWT, manager,upload.single('file'),taskController.deleteTask)

module.exports=router