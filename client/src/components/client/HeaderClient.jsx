"use client";
import React, { useState } from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Setting from "./Setting";

export default function HeaderClient(props) {

  const navigate = useNavigate()
  const id = useSelector(x => x.Id.id)
  const managers = props.managers || {}
  const tasks = props.tasks || {}
  const client = props.client || {}
  const setClient = props.setClient || {}
  const setTasks = props.setTasks || {}
  const token = JSON.parse(localStorage.getItem('token')) || ""
  const [selectedManager, setSelectedManager] = useState({})
  const [showSettings, setShowSettings] = useState(false)
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
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <>
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{client.name ? client.name.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ') : ""}</span>
                  <Button icon="pi pi-sign-out" className="p-button-rounded p-button-text p-button-secondary" onClick={()=>{localStorage.removeItem('token');navigate('/')}}/>
          <Button icon="pi pi-cog" className="p-button-rounded p-button-text p-button-secondary" onClick={() => { setShowSettings(true) }} />
          <div>
            <Avatar
              label={client.imageUrl ? "" : client.name ? client.name[0] : ""}
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
      <div className="card">
        {showSettings && <Setting client={client} setClient={setClient} setShowSettings={setShowSettings}/>}
      </div>
    </>
  );
}