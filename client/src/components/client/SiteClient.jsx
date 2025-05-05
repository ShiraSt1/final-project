import { useLocation } from "react-router-dom";
import HeaderClient from "./HeaderClient"
import TaskPage from "./TaskPage";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const SiteClient = () => {
    const location = useLocation();
    const id=useSelector(x=>x.Id.id)
    const [managers, setManagers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const [client, setClient] = useState({});

    const getClient = async () => {
        try {
            const res = await axios.get(`http://localhost:3005/api/user/getUser/${id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setClient(res.data)
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const getManagers = async () => {
        try {
            const res = await axios.get(`http://localhost:3005/api/user/getClientManagers/${id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setManagers(res.data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getTasks = async () => {
        try {
            const res = await axios.get(`http://localhost:3005/api/task/getTasks/${id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setTasks(res.data.map(task => {
                    return {
                        ...task,
                        managerName: task.connectionId.managerId.name,
                        projectName: task.connectionId.projectId.name
                    }
                }))
                
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getTasks()
        getManagers()
        getClient()
    }, [])


    return (
        <div style={{ marginLeft: "5%",marginRight: "5%",marginButtom: "5%" }}>
            <HeaderClient  managers={managers} tasks={tasks} setTasks={setTasks} client={client} setClient={setClient} />
            <TaskPage managers={managers} tasks={tasks} setTasks={setTasks} client={client} />
        </div>
    )
}
export default SiteClient