import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { RadioButton } from "primereact/radiobutton";
import axios from 'axios'

const Login = () => {
    const [valueId, setValueId] = useState("")
    const [valuePass, setValuePass] = useState("")
    const [valueRole, setValueRole] = useState('');
    const navigate = useNavigate()

    const log_in = async () => {
        try {
            const res = await axios.post('http://localhost:3005/api/login', { userId: valueId, password: valuePass,role:valueRole })
            if (res.status === 200) {
                localStorage.setItem("token", JSON.stringify(res.data.accessToken))
                valueRole=== "manager" ? navigate(`./manager/${res.data.id}`, { state: {id:res.data.id,num :1 }}) : navigate(`./client/${res.data.id}`, { state: res.data.id })
            }
        } catch (err) {
            alert("Invalid User or Password")
            console.error(err)
        }
    }
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <Card title="Task Track" subTitle="LogIn" className="md:w-30rem custom-card p-card-subtitle">
                    {/* <img src={myfamily} alt="My Image" style={{ width: '50px', height: '50px' }}/> */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">UserID</label>
                            <InputText value={valueId} onChange={(e) => setValueId(e.target.value)} id="userid" type="text" className="w-12rem input-focus" />
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Password</label>
                            <InputText value={valuePass} onChange={(e) => setValuePass(e.target.value)} id="password" type="password" className="w-12rem input-focus" />
                        </div>

                        <div className="card flex justify-content-center">
                            <div className="flex flex-wrap gap-3">
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient1" name="user" value="manager" onChange={(e) => setValueRole(e.value)} checked={valueRole === 'manager'} />
                                    <label htmlFor="ingredient1" className="ml-2">manager</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient2" name="user" value="client" onChange={(e) => setValueRole(e.value)} checked={valueRole === 'client'} />
                                    <label htmlFor="ingredient2" className="ml-2">client</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <Button label="Login" icon="pi pi-user" onClick={() => { log_in() }} className="w-10rem mx-auto" style={{ backgroundColor: 'var(--green-600)', border: 'none' }}></Button>
                            <Link to="/signUp">Sign Up</Link>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}
export default Login