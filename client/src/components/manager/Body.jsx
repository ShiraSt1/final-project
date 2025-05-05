"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";
import axios from "axios";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useSelector } from "react-redux";

export default function Body(props) {
    const navigate = useNavigate()
    const contacts = props.contacts || {}
    const setContacts = props.setContacts || {}
    const id=useSelector(x=>x.Id.id)
    const token = JSON.parse(localStorage.getItem('token')) || ""

    const getContacts = async () => {
        try {
            const res = await axios.get(`http://localhost:3005/api/user/getManagerClient/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                const clients = res.data.map(client => { return { ...client.clientId, project: client.projectId.name, projectId: client.projectId._id } })
                setContacts(clients)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const avatarBodyTemplate = (rowData) => {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                    size="large"
                    label={rowData.imageUrl ? "" : rowData.name ? rowData.name[0] : ""}
                    shape="circle"
                    style={{
                        backgroundImage: `url(${rowData.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        marginRight: "10px",
                    }}
                    src={rowData.imageUrl}
                />
                <span>{rowData.name}</span>
            </div>
        );
    }

    const detailsClient = (rowData) => {
        const confirm = (event) => {
            confirmPopup({
                target: event.currentTarget,
                message: 'Do you want to delete this client?',
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                accept: (() => handleDelete()),
                reject: () => { }
            });
        };
        const handleDelete = async () => {
            console.log("rowData:", rowData.projectId);
            console.log("id: ", id);

            const client = { id: rowData._id, managerId: id, projectId: rowData.projectId }
            try {
                const res = await axios.delete(`http://localhost:3005/api/user/deleteClient`,
                    {
                        data: client,
                        headers: { Authorization: `Bearer ${token}` }
                    })
                if (res.status === 200) {
                    const clients = res.data.map(client => { return { ...client.clientId, project: client.projectId.name, projectId: client.projectId._id } })
                    setContacts(clients)
                }
            } catch (err) {
                console.error(err)
            }
        };

        const handleEdit = async () => {
            navigate(`./editClient`, { state: { rowData, num: 3 } })
        };

        const handleDetails = () => {
            navigate(`./Details/${rowData._id}`, { state: { rowData, num: 5 } })
        };

        return (
            <>

                <Button icon="pi pi-trash" className="p-button-text" onClick={(e) => confirm(e)} />
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
            <ConfirmPopup />
            <h2>Clients</h2>
            <DataTable value={contacts} responsiveLayout="scroll">
                <Column field="name" header="Name" body={avatarBodyTemplate} />
                <Column field="email" header="Email" />
                <Column field="phone" header="Phone" />
                <Column field="project" header="Project" />
                <Column header="Details" body={detailsClient} />
            </DataTable>
        </div>
    );
}
