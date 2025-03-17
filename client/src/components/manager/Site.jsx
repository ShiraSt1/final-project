import { createCookie, useLocation } from "react-router-dom";
import Body from "./Body"
import Header from "./Header"
import SideBar from "./SideBar"
import AddForm from "./AddForm"
import UpdateForm from "./UpdateForm"
import Settings from "./Setting"
import { useState } from "react";
import DetailsCalander from "./DetailsCalander";

const Site = () => {
    const location = useLocation();
    const id = location.state.id || {}
    const num = location.state.num || 0
    const rowData = location.state.rowData || {}
    const [contacts, setContacts] = useState([]);
    
    return (
        <div>
            <SideBar id={id} setContacts={setContacts} num={num}/>
            <div className="content">
                {num == 1 || num == 2 || num == 3 || num == 5 ? <Header id={id} contacts={contacts} setContacts={setContacts}/> :null}
                <>
                    {num === 1 ? <Body id={id} contacts={contacts} num={num} setContacts={setContacts} /> : null}
                    {num === 2 ? <AddForm id={id} contacts={contacts} num={num} setContacts={setContacts} /> : null}
                    {num === 3 ? <UpdateForm id={id} contacts={contacts} num={num} setContacts={setContacts} /> : null}
                    {num === 4 ? <Settings id={id} contacts={contacts} num={num} setContacts={setContacts} /> : null}
                    {num === 5 ? <DetailsCalander id={id} contacts={contacts} num={num} rowData={rowData} setContacts={setContacts} /> : null}
                    {num !== 1 && num !==2 && num !== 3 && num !== 4 && num !== 5 ? <p>num: {num}</p> : null}
                </>
            </div>
        </div>
    )
}
export default Site