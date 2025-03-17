import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom";
import axios from 'axios'
import ShowReceiverToOrganizer from './ShowReceiverToOrganizer'
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Sidebar } from "primereact/sidebar";
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';
import { Avatar } from 'primereact/avatar';
import taskLogo from '../pictures/logo.jpg';

const Manager = (props) => {
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const btnRef3 = useRef(null);
    const btnRef4 = useRef(null);
    const [side, setSide] = useState(true);

    const location = useLocation();
    const id = location.state || {}
    const [clientsData, setClientsData] = useState([])
    const [manager, setManager] = useState({})
    const [visible, setVisible] = useState(false);
    const [projects, setProjects] = useState([])
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const token = JSON.parse(localStorage.getItem('token')) || ""

    const getMnager = async() => {
        try{
            const res = await axios.get(`http://localhost:3005/api/user/getManager/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            if(res.status === 200) {
                setManager(res.data)
            }
        }catch (err) {
            console.error(err)
        }
    }

const getData = async () => {
    try {
        const res = await axios.get(`http://localhost:3005/api/user/getManagerClient/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
            setClientsData(res.data)
        }
    } catch (err) {
        console.error(err)
    }
}

const onSubmit = async (data) => {
    const client = { ...data, managerId: id }
    try {
        const res = await axios.post("http://localhost:3005/api/user/addClient", client, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 200) {
            setClientsData(res.data)
        }
    } catch (err) {
        console.error(err)
    }
    setVisible(false);
    reset();
}

const getProjects = async () => {
    try {
        const res = await axios.get(`http://localhost:3005/api/project/getProjects/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
            setProjects(res.data)
        }
    } catch (err) {
        console.error(err)
    }
}

useEffect(() => {
    getData()
    getProjects()
    getMnager()
}, [])

useEffect(() => {
    console.log(projects)
}, [projects])


return (
    <>
        <div className="flex">
            <Sidebar
                visible={true} // תמיד פתוח
                dismissable={false} // מונע סגירה בלחיצה חיצונית
                modal={false} // לא יוצר שכבת רקע כהה
                className="w-64 h-screen fixed left-0 top-0 shadow-lg"
                content={({ closeIconRef, hide }) => (
                    <div className="min-h-screen flex relative lg:static surface-ground">
                        <div id="app-sidebar-2" className="surface-section h-screen block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none" style={{ width: '280px' }}>
                            <div className="flex flex-column h-full">
                                <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                                    <span className="inline-flex align-items-center gap-2">
                                        <img src={taskLogo} style={{ width: '20%', height: 'auto' }} />
                                        <span className="font-semibold text-2xl text-primary">Task Track</span>
                                    </span>
                                </div>

                                <div className="overflow-y-auto">
                                    <ul className="list-none p-3 m-0">

                                        <li>
                                            <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                <i className="pi pi-plus mr-2"></i>
                                                <span className="font-medium">Add Project</span>
                                                <Ripple />
                                            </a>
                                        </li>
                                        <li>
                                            <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                <i className="pi pi-plus mr-2"></i>
                                                <span className="font-medium">Add Client</span>
                                                <Ripple />
                                            </a>
                                        </li>

                                        <li>
                                            <StyleClass nodeRef={btnRef1} selector="@next" enterFromClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                                <div ref={btnRef1} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                                                    <span className="font-medium">PROJECTS</span>
                                                    <i className="pi pi-chevron-down"></i>
                                                    <Ripple />
                                                </div>
                                            </StyleClass>

                                            <ul className="list-none p-0 m-0 overflow-hidden">
                                                {
                                                    projects.length > 0 && projects.map(project => (
                                                        <li key={project._id.toString()}>
                                                            <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                <i className="pi pi-folder mr-2"></i>
                                                                <span className="font-medium">{project.projectId.name}</span>
                                                                <Ripple />
                                                            </a>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </li>
                                    </ul>


                                    <ul className="list-none p-3 m-0">
                                        <li>
                                            <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                <i className="pi pi-cog mr-2"></i>
                                                <span className="font-medium">Settings</span>
                                                <Ripple />
                                            </a>
                                        </li>
                                    </ul>

                                </div>

                                <div className="mt-auto">
                                    <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                                    <a className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                                        <span className="font-bold">{manager.name}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            ></Sidebar>
        </div>


        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
            {
                clientsData.length > 0 && clientsData.map(client => (<ShowReceiverToOrganizer key={client._id.toString()} client={client} setClientsData={setClientsData} />))
            }
        </div>

        <div>
            <Button label="Add Client" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog
                header="Add Client"
                visible={visible}
                style={{ width: '400px' }}
                modal
                onHide={() => setVisible(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="field">
                        <label htmlFor="name">Full Name</label>
                        <InputText id="name" {...register('name', { required: 'required' })} className={errors.name ? 'p-invalid' : ''} />
                        {errors.name && <small className="p-error">{errors.name.message}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="userId">ID</label>
                        <InputText id="userId" {...register('userId', { required: 'required' })}
                            className={errors.userId ? 'p-invalid' : ''}
                        />
                        {errors.userId && <small className="p-error">{errors.userId.message}</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <InputText id="password" type="password" {...register('password', {
                            required: 'required',
                            minLength: { value: 6, message: 'the password must be at least 6 characters' }
                        })}
                            className={errors.password ? 'p-invalid' : ''}
                        />
                        {errors.password && <small className="p-error">{errors.password.message}</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="address">Address</label>
                        <InputText id="address" {...register('address')}
                            className={errors.address ? 'p-invalid' : ''}
                        />
                        {errors.address && <small className="p-error">{errors.address.message}</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText defaultValue="aaa@gmail.com" {...register("email", { required: true, pattern: { value: /^\S+@\S+\.\S+$/, message: 'not correct email' } })} className="input-focus" />
                        {errors.email && <small className="p-error">{errors.email.message}</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="phone">Phone</label>
                        <InputText id="phone" {...register('phone')}
                            className={errors.phone ? 'p-invalid' : ''}
                        />
                        {errors.phone && <small className="p-error">{errors.phone.message}</small>}
                    </div>
                    <div className="p-mt-3">
                        <Button type="submit" label="Add" className="p-button-success" />
                        <Button type="button" label="Cancle" className="p-button-secondary p-ml-2" onClick={() => setVisible(false)} />
                    </div>

                </form>
            </Dialog>
        </div>
    </>
)
}
export default Manager