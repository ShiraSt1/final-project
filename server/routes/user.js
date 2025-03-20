const express = require("express")
const router = express.Router()
const userController=require("../controllers/userController")
const userJWT = require("../middleware/userJWT")

router.post("/addClient",userJWT,userController.addClient)
router.post("/addManager",userController.addManager)
router.get("/getManagerClient/:id",userJWT,userController.getManagerClient)
router.get("/getUser/:id",userJWT,userController.getUser)
router.get("/getClient",userJWT,userController.getClient)
router.get("/getProjectClients/:projectId/:managerId",userJWT,userController.getProjectClients)
router.put("/updateUser",userJWT,userController.updateUser)
router.put("/changePassword",userJWT,userController.changePassword)
router.delete("/deleteClient",userJWT,userController.deleteClient)
router.put("/addImage",userJWT,userController.addImage)
router.get("/getClientManagers/:id",userJWT,userController.getClientManagers)

module.exports=router 