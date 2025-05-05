import { createCookie, useLocation } from "react-router-dom";
import Body from "./Body"
import Header from "./Header"
import SideBar from "./SideBar"
import AddForm from "./AddForm"
import UpdateForm from "./UpdateForm"
import Settings from "./Setting"
import Analitics from "./Analitics"
import Help from "./Help"
import { useEffect, useState } from "react";
import DetailsCalander from "./DetailsCalander";
import axios from "axios";
import { useSelector } from "react-redux";

const Site = () => {
    const location = useLocation();
    const id=useSelector(x=>x.Id.id)
    const token = JSON.parse(localStorage.getItem('token')) || ""

    let num=1;
    let rowData={}
    if(location.state){
        num = location.state.num || 1
        rowData= location.state.rowData || {}
    }

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
            <SideBar contacts={contacts} setContacts={setContacts} num={num} manager={manager} setManager={setManager}/>
            <div className="content">
                <Header num={num} contacts={contacts} setContacts={setContacts} manager={manager} setManager={setManager}/>
                <>
                    {num === 1 ? <Body contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 2 ? <AddForm contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 3 ? <UpdateForm  contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 4 ? <Settings contacts={contacts} num={num} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 5 ? <DetailsCalander contacts={contacts} num={num} rowData={rowData} setContacts={setContacts} manager={manager} setManager={setManager}/> : null}
                    {num === 6 ? <Help/> : null}
                    {num === 7 ? <Analitics/> : null}
                    {num !== 1 && num !==2 && num !== 3 && num !== 4 && num !== 5 ? <p>num: {num}</p> : null}
                </>
            </div>
        </div>
        
        </>
    )
}
export default Site