"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import logo from "../../pictures/logo.jpg"
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useSelector } from "react-redux";
import { Tooltip } from 'primereact/tooltip';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { InputTextarea } from "primereact/inputtextarea";

export default function SideBar(props) {
  const id = useSelector(x => x.Id.id)
  const num = props.num || {}
  const setContacts = props.setContacts || {}
  const contacts = props.contacts || {}
  const [copyContacts, setCopyContacts] = useState([])
  const token = JSON.parse(localStorage.getItem('token')) || ""
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showAddTaskToAllClients, setShowAddTaskToAllClients] = useState(false);
  const [taskToAlllClients, setTaskToAlllClients] = useState({ managerId: id });
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projects, setProjects] = useState([])
  const [projectName, setProjectName] = useState("")
  const toast = useRef(null);

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
        navigate(0, { state: { num: 1 } })
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

  const showProjectContact = (projectId) => {
    setContacts(copyContacts.filter((contact) => {
      return contact.projectId === projectId
    }))
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

  const addTaskToAllClients = () => {
    const formData = new FormData();
    formData.append("title", taskToAlllClients.title);
    formData.append("date", taskToAlllClients.date);
    formData.append("managerId", taskToAlllClients.managerId);
    formData.append("projectId", taskToAlllClients.projectId);
    formData.append("file", taskToAlllClients.file);
    if (taskToAlllClients.description) {
      formData.append("description", taskToAlllClients.description)
    }
    try {
      contacts.map(async (contact, index) => {
        if (contact.projectId === taskToAlllClients.projectId) {
          formData.delete("clientId")
          formData.append("clientId", contact._id);
          const res = await axios.post(`http://localhost:3005/api/task/addTask`, formData,
            { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 200) {

            if (index === contacts.length - 1) {
              setTaskToAlllClients({
                managerId: id,
                projectId: "",
                title: "",
                description: "",
                date: "",
                file: {}
              })
              toast.current.show({severity:'success', summary: 'Success', detail:'Task Aadded to all the clients in the group', life: 3000});
            }
          }
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (copyContacts.length === 0) {
      setCopyContacts([...contacts]);
    }
  }, [contacts]);

  const confirm = (event, projectId) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Do you want to delete this project?',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      accept: (() => { deleteProject(projectId) }),
      reject: () => { }
    });
  };

  const items = [
    {
      label: "Users",
      icon: "pi pi-users",
      items: [
        { label: "All Clients", icon: "pi pi-list", command: () => { num === 1 ? navigate(0, { state: { num: 1 } }) : navigate(`/manager/${id}`, { state: { num: 1 } }) } },
        { label: "Add Client", icon: "pi pi-user-plus", command: () => { num === 2 ? navigate(0, { state: { num: 2 } }) : navigate(`/manager/${id}/AddClient`, { state: { num: 2 } }) } }
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
              className="highlight-div"
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
              <ConfirmPopup />
              <i
                className="pi pi-trash"
                style={{ cursor: 'pointer', marginLeft: 'auto' }}
                onClick={(e) => {
                  confirm(e, project._id);
                }}
              />
              <Tooltip target=".edit-icon" content="Add a task to all the group" />
              <i
                className="pi pi-pen-to-square edit-icon"
                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                style={{ cursor: 'pointer', marginLeft: '5px' }}
                onClick={() => { setTaskToAlllClients({ ...taskToAlllClients, projectId: project._id }); setShowAddTaskToAllClients(true) }}
              />
            </div>
          )
        })) : []),
        { label: "Add Project", icon: "pi pi-plus", command: () => setShow(true) }
      ]
    },
    { label: "Analytics", icon: "pi pi-chart-bar", command: () => { navigate(`/manager/${id}/Analitics`, { state: { id, num: 7 } }) } },
    { label: "Settings", icon: "pi pi-cog", command: () => { navigate(`/manager/${id}/Settings`, { state: { id, num: 4 } }) } },
    { label: "Help", icon: "pi pi-question", command: () => { navigate(`/manager/${id}/Help`, { state: { id, num: 6 } }) }},
  ];

  return (
    <>

      <div className="app-container">
      <Toast ref={toast} />
        {/* Sidebar קבוע במסכים גדולים */}
        {!isMobile && (
          <div className="sidebar">
            <h2>Menu</h2>
            <Menu model={items} className="w-full" />
            {/* logo*/}
            {/* <div className="side-bar-title">
              <img src={logo} alt="logo" className="card-icon-side" />
              <h1 style={{ fontSize: '50px', textAlign: 'center', margin: '0' }}>Task Track</h1>
            </div> */}
            {/*logo */}
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
          {/* logo*/}
          {/* <div className="side-bar-title">
            <img src={logo} alt="logo" className="card-icon-side" />
            <h1 style={{ fontSize: '40px', textAlign: 'center', margin: '0' }}>Task Track</h1>
          </div> */}
          {/*logo */}
        </Sidebar>
      </div>


      <Dialog
        visible={show}
        modal
        onHide={() => { if (!show) return; setShow(false); }}
        content={({ hide }) => (
          <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
            <h2 style={{textAlign:'center'}}>Add a new project</h2>
            <div className="inline-flex flex-column gap-2">
              <InputText onChange={(e) => setProjectName(e.target.value)} className="input-focus" placeholder="Project Name" id="projectname" label="Projectname" type="text" ></InputText>
            </div>
            <div className="flex align-items-center gap-2">
              {projectName?
              <Button label="Add" onClick={(e) => {
                hide(e); addProject()
              }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>:
              <Button disabled label="Add" onClick={(e) => {
                hide(e); addProject()
              }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>
            }
              <Button label="Cancel" onClick={(e) => hide(e)} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>
            </div>
          </div>
        )}
      ></Dialog>

      <Dialog
        visible={showAddTaskToAllClients}
        modal
        onHide={() => { if (!showAddTaskToAllClients) return; setShowAddTaskToAllClients(false); }}
        content={({ hide }) => (
          <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
            <h2 style={{textAlign:'center'}}>Add a task to all the group</h2>
            <div className="inline-flex flex-column gap-2">
              <InputText onChange={(e) => setTaskToAlllClients({ ...taskToAlllClients, title: e.target.value })} className="input-focus" placeholder="Task Title" id="tasktitle" label="tasktitle" type="text" ></InputText>
            </div>
            <div className="inline-flex flex-column gap-2">
              <InputTextarea onChange={(e) => setTaskToAlllClients({ ...taskToAlllClients, description: e.target.value })} className="input-focus" placeholder="Description" id="Description" label="Projectname" type="text" ></InputTextarea>
            </div>
            <div className="inline-flex flex-column gap-2">
              <Calendar placeholder="Date" value={taskToAlllClients.date} onChange={(e) => setTaskToAlllClients({ ...taskToAlllClients, date: e.target.value })} />
            </div>
            <div className="inline-flex flex-column gap-2 justify-content-center">
              <FileUpload chooseLabel="Upload Files"
                chooseOptions={{ style: { width: '100%', color: "green", background: "white", border: '1px solid green' } }}
                mode="basic" name="demo[]" url="/api/upload" maxFileSize={1000000}
                onSelect={(e) => {
                  const newFile = e.files[0];

                  setTaskToAlllClients({
                    ...taskToAlllClients, file: newFile
                  })
                }}
              />
            </div>
            <div className="flex align-items-center gap-2">
              {(taskToAlllClients.title && taskToAlllClients.date) ?
              <Button label="Add" onClick={(e) => {
                hide(e); addTaskToAllClients()
              }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>:
              <Button disabled label="Add" onClick={(e) => {
                hide(e); addTaskToAllClients()
              }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>
              }
              <Button label="Cancel" onClick={(e) => {hide(e);setTaskToAlllClients({
                managerId: id,
                projectId: "",
                title: "",
                description: "",
                date: "",
                file: {}
              })}} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>
            </div>
          </div>
        )}
      ></Dialog>

    </>
  );
}