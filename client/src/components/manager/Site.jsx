import { createCookie, useLocation } from "react-router-dom";
import Body from "./Body"
import Header from "./Header"
import SideBar from "./SideBar"
import AddForm from "./AddForm"
import UpdateForm from "./UpdateForm"
import Settings from "./Setting"
import { useEffect, useState } from "react";
import DetailsCalander from "./DetailsCalander";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";

const Site = () => {
    const location = useLocation();
    const id = location.state.id || {}
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const num = location.state.num || 0
    const rowData = location.state.rowData || {}
    const [contacts, setContacts] = useState([]);
    const [manager,setManager]=useState({})

    const getManager = async () => {
        try {
            const res = await axios.get(`http://localhost:3005/api/user/getUser/${id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setManager(res.data)
            }
        }
        catch (err) {
            console.error(err)
        }
    }
    
    useEffect(() => {
      getManager() 
    }, [])
    
    return (
        <>
        <div>
            <SideBar id={id} setContacts={setContacts} num={num} manager={manager} setManager={setManager}/>
            <div className="content">
                {num == 1 || num == 2 || num == 3 || num == 5 ? <Header id={id} num={num} contacts={contacts} setContacts={setContacts} manager={manager} setManager={setManager}/> :null}
                <>
                    {num === 1 ? <Body id={id} contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 2 ? <AddForm id={id} contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 3 ? <UpdateForm id={id} contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 4 ? <Settings id={id} contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 5 ? <DetailsCalander id={id} contacts={contacts} num={num} rowData={rowData} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num !== 1 && num !==2 && num !== 3 && num !== 4 && num !== 5 ? <p>num: {num}</p> : null}
                </>
            </div>
        </div>
        
        </>
    )
}
export default Site