"use client";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";

export default function HeaderClient(props) {

  const navigate = useNavigate()
  const id = props.id || {}
  const managers = props.managers || {}
  const tasks = props.tasks || {}
  const client = props.client || {}
  const setClient = props.setClient || {}
  const setTasks = props.setTasks || {}
  const token = JSON.parse(localStorage.getItem('token')) || ""
  const [selectedManager, setSelectedManager] = useState({})

  const handleAvatarClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageUpload = (event) => {

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await axios.put(`http://localhost:3005/api/user/addImage`, { id, imageUrl: reader.result },
            { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 200) {
            setClient(res.data)
          }
        } catch (err) {
          console.error(err)
        }
        // setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <div
      className="header-container"
      style={{
        position: "fixed",
        top: 0,
        left: "0",
        right: "0",
        width: "100%",
        height: "80px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        border: "1px solid #ccc",
        zIndex: 2
      }}
    >
      <h2></h2>
      <h2></h2>
      <div >
        <Dropdown value={selectedManager} onChange={(e) => setSelectedManager(e.value)} options={managers} optionLabel="managerId" 
          placeholder="Select a Project" className="w-full md:w-14rem" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>{client.name}</span>
        <Button icon="pi pi-bell" className="p-button-rounded p-button-text p-button-secondary" />
        <Button icon="pi pi-envelope" className="p-button-rounded p-button-text p-button-secondary" />
        <Button icon="pi pi-cog" className="p-button-rounded p-button-text p-button-secondary" onClick={() => { navigate(`/client/${id}/settings`, { state: id }) }} />
        <Button icon="pi pi-commennt" className="p-button-rounded p-button-text p-button-secondary" onClick={() => { navigate(`/client/${id}/chat`, { state: id }) }} />
        {/* */}
        {/*5555*/}
        {/* <Avatar label='A' size="large" shape="circle" /> */}
        <div>
          <Avatar
            // label='a'
            size="large"
            shape="circle"
            onClick={handleAvatarClick}
            style={{
              cursor: "pointer",
              backgroundImage: `url(${client.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            src={client.imageUrl}
          />
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  );
}