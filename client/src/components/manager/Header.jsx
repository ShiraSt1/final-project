"use client";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header(props) {
  const navigate=useNavigate()
  const location = useLocation();
  const [manager, setManager] = useState({});
  const id = props.id || {}
  const num = props.num || {}
  const contacts = props.contacts || {}
  const setContacts = props.setContacts || {}
  const token = JSON.parse(localStorage.getItem('token')) || ""
  // const [image, setImage] = useState(null);

  const handleAvatarClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageUpload = (event) => {
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async() => {
        try{
          const res = await axios.put(`http://localhost:3005/api/user/addImage`,{id,imageUrl:reader.result},
            { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
            setManager(res.data)
        }
        } catch(err){
          console.error(err)
        }       
        // setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  ////////////////////////////////////////////צריך לעשות העתק של המערך של האנשי קשר
  const searchName=(valName)=>{    
    setContacts(contacts.filter(contact=>{
        return contact.name.includes(valName)
    }))
  }

  const getManager = async () => {
    try {
        const res = await axios.get(`http://localhost:3005/api/user/getManager/${id}`,
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
      // boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
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
    <div className="p-inputgroup" style={{ width: "45%" }} id="search">
      <span className="p-inputgroup-addon">
        <i className="pi pi-search" />
      </span>
      <InputText type="text" className="p-inputtext-lg" placeholder="Search..." onChange={(e)=>{searchName(e.target.value)}}/>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span>{manager.name}</span>
      <Button icon="pi pi-bell" className="p-button-rounded p-button-text p-button-secondary" />
      <Button icon="pi pi-envelope" className="p-button-rounded p-button-text p-button-secondary" />
      <Button icon="pi pi-user" className="p-button-rounded p-button-text p-button-secondary" />
      <Button icon="pi pi-cog" className="p-button-rounded p-button-text p-button-secondary" onClick={()=>{num===4? navigate(0,{ state: {id,num:4}}): navigate(`/manager/${id}/settings`,{state: {id,num :4 }}) }}/>
      {/* <Avatar label='A' size="large" shape="circle" /> */}
      <div>
          <Avatar
            // label='a'
            size="large"
            shape="circle"
            onClick={handleAvatarClick}
            // style={{ cursor: "pointer" }}
            style={{ 
              cursor: "pointer", 
              backgroundImage: `url(${manager.imageUrl})`, 
              backgroundSize: "cover", 
              backgroundPosition: "center" 
            }}
            src={manager.imageUrl}
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