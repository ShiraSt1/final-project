const express = require("express")
const router = express.Router()
const projectController=require("../controllers/projectController")
const userJWT = require("../middleware/userJWT")
const manager = require("../middleware/managerMiddleware")

router.post("/addProject",userJWT,manager,projectController.addProject)
router.get("/getProjects/:id",userJWT,manager,projectController.getProjects)
router.put("/updateProject",userJWT,manager,projectController.updateProject)
router.delete("/deleteProject",userJWT,manager,projectController.deleteProject)

module.exports=router