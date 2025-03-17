"use client";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddForm(props) {
    const navigate=useNavigate()
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const id = props.id || {}
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [contact, setContact] = useState({
        name: "",
        userId: "",
        phone: "",
        address: "",
        email: ""
    });

    const getProjects = async () => {
        try {
            const res = await axios.get(`http://localhost:3005/api/project/getProjects/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                const dataProject = res.data.map(project => { return project.projectId })
                setProjects(dataProject)
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleChange = (e) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const client = { ...contact, projectId: selectedProject._id, managerId: id, password: contact.phone }
        try{
            const res=await axios.post(`http://localhost:3005/api/user/addClient`,client, { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                navigate(`../manager/${id}`, { state:{id,num:1} })
            }
        }catch(err){
            console.error(err)
        }
    };

    useEffect(() => {
        getProjects()
    }, [])
    
    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form-content">
                <div className="profile-section">
                    <Avatar icon="pi pi-user" size="xlarge" shape="circle" className="profile-avatar" />
                </div>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-user" />
                    </span>
                    <InputText
                        name="name"
                        placeholder="full name"
                        value={contact.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-id-card" />
                    </span>
                    <InputText
                        name="userId"
                        placeholder="id"
                        value={contact.userId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-phone" />
                    </span>
                    <InputText
                        name="phone"
                        placeholder="phone"
                        value={contact.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-map-marker" />
                    </span>
                    <InputText
                        name="address"
                        placeholder="address"
                        value={contact.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-envelope" />
                    </span>
                    <InputText
                        name="email"
                        placeholder="email"
                        value={contact.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-briefcase" />
                    </span>
                    <Dropdown
                        value={selectedProject}
                        onChange={(e) => { setSelectedProject(e.value) }}
                        options={projects}
                        optionLabel="name"
                        placeholder="project"
                        style={{ textAlign: 'left' }}
                        required
                        className="w-full md:w-14rem" />
                </div>

                <Button type="submit" label="save" className="p-button-outlined save-btn" />
            </form>
        </div>
    );
}