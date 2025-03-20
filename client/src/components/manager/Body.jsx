"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";
import axios from "axios";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function Body(props) {
    const navigate=useNavigate()
    const contacts=props.contacts || {}
    const setContacts=props.setContacts || {}
    const id = props.id || {}
    const token = JSON.parse(localStorage.getItem('token')) || ""

    const getContacts = async () => {        
        try {
            const res = await axios.get(`http://localhost:3005/api/user/getManagerClient/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                const clients=res.data.map(client=>{return {...client.clientId,project:client.projectId.name,projectId:client.projectId._id}})
                setContacts(clients)                
            }
        } catch (err) {
            console.error(err)
        }
    }
    
    // רינדור עמודת תמונה (אם יש תמונה מציגים אותה, אחרת מציגים אות ראשונה)
    const avatarBodyTemplate = (rowData) => {
        return typeof rowData.avatar === "string" && rowData.avatar.startsWith("http") ? (
            <Avatar image={rowData.avatar} shape="circle" size="large" />
        ) : (
            <Avatar label={rowData.avatar} shape="circle" size="large" />
        );
    };

const detailsClient = (rowData) => {
    const handleDelete = async() => {
        const client={id:rowData._id,managerId:id,projectId:rowData.projectId}
        try {
            const res = await axios.delete(`http://localhost:3005/api/user/deleteClient`, 
               {data:client,
                headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                const clients=res.data.map(client=>{return {...client.clientId,project:client.projectId.name}})
                setContacts(clients)                
            }
        } catch (err) {
            console.error(err)
        }
    };

    const handleEdit = async() => {
        // navigate(`./editClient`,{state:{id,rowData,num:3}})
    };

    const handleDetails = () => {
        navigate(`./Details/${rowData._id}`,{state:{id,rowData,num:5}})
    };

    return (
        <>
            <Button icon="pi pi-trash" className="p-button-text" onClick={handleDelete} />
            <Button icon="pi pi-pencil" className="p-button-text" onClick={handleEdit} />
            <Button label="Details" icon="pi pi-eye" className="p-button-text" onClick={handleDetails} />
        </>
    );
};

    useEffect(() => {
        getContacts()
    }, [])

    return (
        <div className="card">
            <h2>Clients</h2>
            <DataTable value={contacts} responsiveLayout="scroll">
                <Column field="name" header="Name" />
                <Column field="email" header="Email" />
                <Column field="phone" header="Phone" />
                <Column field="project" header="Project" />
                <Column header="Profil" body={avatarBodyTemplate} />
                <Column header="Details" body={detailsClient}/>
            </DataTable>
        </div>
    );
}
