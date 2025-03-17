"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import Header from './Header';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

export default function SideBar(props) {
  const id = props.id || {}
  const num = props.num || {}
  const setContacts = props.setContacts || {}
  const token = JSON.parse(localStorage.getItem('token')) || ""
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projects, setProjects] = useState([])
  const [projectName, setProjectName] = useState("")
  const [professions, setProfessions] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState(null);

  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen);
  };

  const deleteProject = async (projectId) => {
    try {
      const res = await axios.delete(`http://localhost:3005/api/project/deleteProject/`,
        {
          data: { projectId, managerId: id },
          headers: { Authorization: `Bearer ${token}` }
        })
      if (res.status === 200) {
        const dataProject = res.data.map(project => { return project.projectId })
        setProjects(dataProject)
        navigate(0,{ state: {id,num:1} })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getProjects = async () => {
    
    try {
      const res = await axios.get(`http://localhost:3005/api/project/getProjects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200) {

        const dataProject = res.data.map(project => { return project.projectId })
        setProjects(dataProject)
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getProjects()
  }, [])

  // בדיקה האם מדובר במסך קטן
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1350);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const showAdd=()=>{
  //   setShow(true)
  //   try {
  //     // const res = axios.get("https://gitlab.example.com/api/v4/projects/1/jobs", {
  //     const res = axios.get("https://data.gov.il/api/3/action/datastore_search", {
  //       params: { scope: ["pending", "running"] },
  //       headers: { Authorization: `Bearer ${token}`}
  //     })
  //     if (res === 200) {
  //       console.log(res.data)
  //       setProfessions(res.data.map(job => ({ name: job.name, id: job.id })));
  //     }
  //   } catch (err) {
  //     console.error("Error:", err)
  //   }
  // }

  const showProjectContact = async (projectId) => {
    try {
      const res = await axios.get(`http://localhost:3005/api/user/getProjectClients/${projectId}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      if (res.status === 200) {
        const dataClients = res.data.map(client => { return {...client.clientId,project:client.projectId.name,projectId:client.projectId._id}})
        setContacts(dataClients)
        // num===1?navigate(0,{state:{id,num:1}}):navigate(`../manager/${id}`,{ state: {id,num:1 }})
      }
    } catch (err) {
      console.error(err)
    }
  }

  const addProject = async () => {
    const project = { name: projectName, managerId: id }
    try {
      const res = await axios.post(`http://localhost:3005/api/project/addProject`, project, { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200) {
        const projectData = res.data.map(pro => { return pro.projectId })
        setProjects(projectData)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const items = [
    { label: "Dashboard", icon: "pi pi-home", command: () => console.log("Dashboard Clicked") },
    {
      label: "Users",
      icon: "pi pi-users",
      items: [
        { label: "All Clients", icon: "pi pi-list", command: () => {num===1?  navigate(0,{ state: {id,num:1} }):navigate(`/manager/${id}`,{ state: {id,num:1 }})}},
        { label: "Add Client", icon: "pi pi-user-plus", command: () => {num===2 ? navigate(0,{ state: {id,num:2} }): navigate(`/manager/${id}/AddClient`,{ state: {id,num:2 }})}}
      ]
    },
    {
      label: "Projects",
      items: [
        {
          label: "All Projects",
          icon: isProjectsOpen ? "pi pi-chevron-up" : "pi pi-chevron-down",
          command: toggleProjects
        },
        ...(isProjectsOpen ? projects.map(project => ({
          template: (item, options) => (
            <div
              onClick={() => showProjectContact(project._id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '90%',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}>
              <span >{`-${project.name}`}</span>
              <i
                className="pi pi-trash"
                style={{ cursor: 'pointer', marginLeft: 'auto' }}
                onClick={() => deleteProject(project._id)}
              />
            </div>
          )
        })) : []),
        { label: "Add Project", icon: "pi pi-plus", command: () => setShow(true) }
      ]
    },
    { label: "Analytics", icon: "pi pi-chart-bar", command: () => console.log("Analytics Clicked") },
    { label: "Settings", icon: "pi pi-cog", command: ()=>{num===4? navigate(0,{ state: {id,num:4}}): navigate(`/manager/${id}/settings`,{state: {id,num :4 }})}},
    { label: "Help", icon: "pi pi-question", command: () => console.log("Help Clicked") }
  ];

  return (
    <>
      <div className="app-container">
        {/* Sidebar קבוע במסכים גדולים */}
        {!isMobile && (
          <div className="sidebar">
            <h2>Menu</h2>
            <Menu model={items} className="w-full" />
          </div>
        )}

        {/* כפתור לפתיחת ה-Sidebar במסכים קטנים */}
        {isMobile && (
          <Button
            icon="pi pi-bars"
            className="p-button-rounded p-button-text mobile-menu-button custom-icon-button"
            onClick={() => setVisible(true)}
          />
        )}

        {/* Sidebar במסכים קטנים */}
        <Sidebar visible={visible} onHide={() => setVisible(false)} className="p-sidebar-md">
          <h2>Menu</h2>
          <Menu model={items} className="w-full" />
        </Sidebar>
      </div>


      <Dialog
        visible={show}
        modal
        onHide={() => { if (!show) return; setShow(false); }}
        content={({ hide }) => (
          <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
            <div className="inline-flex flex-column gap-2">
              <InputText onChange={(e) => setProjectName(e.target.value)} className="input-focus" placeholder="Project Name" id="projectname" label="Projectname" type="text" ></InputText>
            </div>
            <Dropdown
              value={selectedProfession}
              options={professions}
              onChange={(e) => setSelectedProfession(e.value)}
              optionLabel="name" // מציג את שם המקצוע
              placeholder="בחר מקצוע"
              className="w-full md:w-20rem"
            />
            <div className="flex align-items-center gap-2">
              <Button label="Add" onClick={(e) => {
                hide(e); addProject()
              }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>
              <Button label="Cancel" onClick={(e) => hide(e)} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>
            </div>
          </div>
        )}
      ></Dialog>
    </>
  );
}