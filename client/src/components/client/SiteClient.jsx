import { useLocation } from "react-router-dom";
import HeaderClient from "./HeaderClient"
import TaskPage from "./TaskPage";
import { useEffect, useState } from "react";
import axios from "axios";

const SiteClient = () => {
    const location = useLocation();
    const id = location.state || {}
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
                const tasksData = res.data.map((connection, index) => {
                    return connection.map((task) => {
                        return { ...task, connection: index }
                    })
                })
                const flattenedTasks = tasksData.flat();
                setTasks(flattenedTasks)
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

    useEffect(() => {
        console.log("manager",managers);
    }, [managers])

    return (
        <div style={{ margin: "5%" }}>
            <HeaderClient id={id} managers={managers} tasks={tasks} setTasks={setTasks} client={client} setClient={setClient}/>
            <TaskPage id={id} managers={managers} tasks={tasks} setTasks={setTasks} client={client}/>
        </div>
    )
}
export default SiteClient