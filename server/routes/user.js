const express = require("express")
const router = express.Router()
const userController=require("../controllers/userController")
const userJWT = require("../middleware/userJWT")

router.post("/addClient",userJWT,userController.addClient)
router.post("/addManager",userController.addManager)
router.get("/getManagerClient/:id",userJWT,userController.getManagerClient)
router.get("/getManager/:id",userJWT,userController.getManager)
router.get("/getClient",userJWT,userController.getClient)
router.get("/getProjectClients/:projectId/:managerId",userJWT,userController.getProjectClients)
router.put("/updateUser",userJWT,userController.updateUser)
router.delete("/deleteClient",userJWT,userController.deleteClient)
router.put("/addImage",userJWT,userController.addImage)

module.exports=router 