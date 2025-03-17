const User = require("../models/User");
const Project = require("../models/Project");
const ProjectToManager = require("../models/ProjectToManager");
const Connection = require("../models/Connection");

const addProject = async (req, res) => {
    const { name, managerId } = req.body
    if (!name || !managerId) {
        return res.status(400).send("name and managerId are required")
    }

    let projectExist = await Project.findOne({ name }).lean()
    if (!projectExist) {
        projectExist = await Project.create({ name });
        if (!projectExist) {
            return res.status(400).send("project not created")
        }
    }

    const managerIdExist = await User.findById(managerId).lean()

    if (!managerIdExist) {
        return res.status(400).send("manager not found")
    }

    const projectToManager = await ProjectToManager.create({ projectId: projectExist._id, managerId });
    if (!projectToManager) {
        return res.status(400).send("project not created")
    }

    const projects = await ProjectToManager.find({ managerId: managerId }).populate("projectId").lean()
    if (!projects) {
        return res.status(400).send("projects not found")
    }
    res.json(projects)
}

const getProjects = async (req, res) => {
    const { id } = req.params

    const projects = await ProjectToManager.find({ managerId: id }).populate('projectId').lean();
    if (!projects)
        return res.status(400).send("project not found")
    res.json(projects)
}

const updateProject = async (req, res) => {
    const { id, name, managerId } = req.body

    if (!id || !name) {
        return res.status(400).send("name and id  are required")
    }

    const project = await Project.findById(id).exec();
    if (!project) {
        return res.status(400).send("project not found")
    }

    project.name = name

    const newProject = await project.save()
    if (!newProject) {
        return res.status(400).send("project not updated")
    }

    const projects = await ProjectToManager.find({ managerId: managerId }).populate("projectId").lean();
    if (!projects)
        return res.status(400).send("projects not found")
    res.json(projects)
}

const deleteProject = async (req, res) => {
    const { managerId, projectId } = req.body
    if (!managerId || !projectId) {
        return res.status(400).send("managerId and projectId are required")
    }
    const project = await ProjectToManager.findOne({ projectId, managerId }).exec();
    if (!project) {
        return res.status(400).send("project not found")
    }

    const result = await project.deleteOne()
    if (!result) {
        return res.status(400).send("project not deleted")
    }

    const projectexist = await ProjectToManager.findOne({ projectId }).exec()

    if (!projectexist) {

        const p = await Project.findById(projectId).exec()

        if (!p) {
            return res.status(400).send("p not found")
        }
        const resultProject = await p.deleteOne()

        if (!resultProject) {
            return res.status(400).send("project not deleted")
        }
    }

    const connections = await Connection.find({ managerId, projectId }).exec()
    if (connections) {
        connections.forEach(async connection => {
            const res = await connection.deleteOne()
            if (!res) {
                return res.status(400).send("connection not deleted")
            }
            const user = await Connection.findOne({ clientId: connection.clientId })
            if (!user) {
                const client = await User.findById(connection.clientId).exec()
                const clientDel = await client.deleteOne()
                if (!clientDel) {
                    return res.status(400).send("clientDel not deleted")
                }
            }
        })
    }

    const projects = await ProjectToManager.find({ managerId: managerId }).populate("projectId").lean();
    if (!projects) {
        return res.status(400).send("projects not found")
    }
    res.json(projects)
}

module.exports = {
    addProject,
    getProjects,
    updateProject,
    deleteProject
}