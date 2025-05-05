import React, { use, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { TabView, TabPanel } from 'primereact/tabview';
import { User, Mail, Phone, Lock, MapPin } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast'; 

export default function Settings(props) {
    const location = useLocation();
    const id=useSelector(x=>x.Id.id)
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const client = props.client || {}
    const setClient = props.setClient || {}
    const [newClient,setNewClient]=useState(client)
    const setShowSettings = props.setShowSettings || {}
    const toast = useRef(null); 
    
    const updateUser = async () => {
        try {
            const res = await axios.put(`http://localhost:3005/api/user/updateUser`, { ...newClient, id: client._id },
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setClient(res.data)
                // "updated"
                toast.current.show({ severity: 'success', summary: 'Updated', detail:` Client details updated`, life: 3000 });
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const changePassword = async () => {
        try {
            const res = await axios.put(`http://localhost:3005/api/user/changePassword`, { id: client._id, password: newClient.password, newPassword: newClient.newPassword },
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setClient(res.data)
                // alert("updated")
                toast.current.show({ severity: 'success', summary: 'Updated', detail:` Client password updated`, life: 3000 });
            }
        }
        catch (err) {
            console.error(err)
        }
    }
    const handleChange = (e) => {
        setNewClient({ ...newClient, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto py-10 card">
            <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-text"
                    style={{
                        color: "black",
                    }}
                    onClick={() => setShowSettings(false)}
                />
            <Card className="text-center">
                <Avatar style={{ transform: 'scale(1.5)' }} image={client.imageUrl} size="xlarge" shape="circle" className="mx-auto mb-4" icon="pi pi-user" />
                <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
            </Card>
            {/*ruth----- add className="input-focus" to all inputtext --------------------*/}
            <TabView className="mt-6 ">
                <TabPanel header="General" >
                    <Card>
                        <div className="p-6">
                            <div className="flex align-items-center mb-4">
                                <User size={18} className="mr-2" />
                                <InputText name="name" value={newClient.name} onChange={handleChange} style={{ width: '50%' }} className="input-focus" />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <Mail size={18} className="mr-2" />
                                <InputText name="email" value={newClient.email} onChange={handleChange} style={{ width: '50%' }} className="input-focus" />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <Phone size={18} className="mr-2" />
                                <InputText name="phone" value={newClient.phone} onChange={handleChange} style={{ width: '50%' }} className="input-focus" />
                            </div>
                            <div className="flex align-items-center mb-4">
                                <MapPin size={18} className="mr-2" />
                                <InputText name="address" value={newClient.address} onChange={handleChange} style={{ width: '50%' }} className="input-focus" />
                            </div>
                            <Toast ref={toast} />
                            <Button onClick={() => { updateUser() }} label="Save Changes" style={{ width: '20%', marginLeft: '2.3%', color: "green", background: "white", border: '1px solid green' }} className="input-focus" />
                        </div>
                    </Card>
                </TabPanel>

                <TabPanel header="Security" >
                    <Card>
                        <div className="p-6">
                            <div className="flex align-items-center mb-4" >
                                <Lock size={18} className="mr-2" />
                                <InputText type="password" placeholder="Old Password" name="password" onChange={handleChange} style={{ width: '50%' }} className="input-focus" />
                            </div>
                            <div className="flex align-items-center mb-4" >
                                <Lock size={18} className="mr-2" />
                                <InputText type="password" placeholder="New Password" name="newPassword" onChange={handleChange} style={{ width: '50%' }} className="input-focus" />
                            </div>
                            <Toast ref={toast} />
                            <Button label="Update Password" onClick={() => { changePassword() }} style={{ width: '20%', marginLeft: '2.3%', color: "green", background: "white", border: '1px solid green' }} className="input-focus" />
                        </div>
                    </Card>
                </TabPanel>
            </TabView>
        </div>
    );
}