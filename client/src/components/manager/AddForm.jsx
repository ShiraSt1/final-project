"use client";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

export default function AddForm(props) {
    const navigate=useNavigate()
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const id=useSelector(x=>x.Id.id)
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
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

    const onSubmit = async(e) => {
        e.preventDefault();
        const client = { ...contact, projectId: selectedProject._id, managerId: id, password: contact.phone }
        try{
            const res=await axios.post(`http://localhost:3005/api/user/addClient`,client, { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                navigate(`../manager/${id}`, { state:{num:1} })
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
            <form onSubmit={onSubmit} className="form-content">
                <div className="profile-section">
                    <Avatar icon="pi pi-user" size="xlarge" shape="circle" className="profile-avatar" />
                </div>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-user" />
                    </span>

                    <InputText required
                        name="name"
                        placeholder="full name"
                        value={contact.name}
                        onChange={handleChange}
                        className="input-focus"
                    />
                </div>

                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-id-card" />
                    </span>
                    <InputText required
                        name="userId"
                        placeholder="id"
                        value={contact.userId}
                        onChange={handleChange}
                        className="input-focus"
                    />
                </div>

                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-phone" />
                    </span>
                    <InputText required
                        name="phone"
                        placeholder="phone"
                        value={contact.phone}
                        onChange={handleChange}
                        className="input-focus"
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
                        className="input-focus"
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
                        className="input-focus"
                        type={"email"}
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
                        className="w-full md:w-14rem input-focus" />
                </div>
                <Button type="submit" label="save" className="p-button-outlined save-btn" />
            </form>
        </div>
    );
}











// "use client";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";
// import { Avatar } from "primereact/avatar";
// import { Dropdown } from "primereact/dropdown";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const AddForm=() =>{
//     const navigate = useNavigate();
//     const token = JSON.parse(localStorage.getItem('token')) || "";
//     const id = useSelector(x => x.Id.id);
//     const [selectedProject, setSelectedProject] = useState(null);
//     const [projects, setProjects] = useState([]);
//     const { register, handleSubmit, setValue, formState: { errors } } = useForm();

//     const getProjects = async () => {
//         try {
//             const res = await axios.get(`http://localhost:3005/api/project/getProjects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//             if (res.status === 200) {
//                 console.log(res.data);
                
//                 setProjects(res.data);
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const onSubmit = async (data) => {
//         if (!selectedProject) return;
//         const client = {
//             ...data,
//             projectId: selectedProject._id,
//             managerId: id,
//             password: data.phone
//         };
//         try {
//             const res = await axios.post(`http://localhost:3005/api/user/addClient`, client, { headers: { Authorization: `Bearer ${token}` } });
//             if (res.status === 200) {
//                 navigate(`../manager/${id}`, { state: { num: 1 } });
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         getProjects();
//     }, []);

//     return (
//         <div className="form-container">
//             <form onSubmit={handleSubmit(onSubmit)} className="form-content">
//                 <div className="profile-section">
//                     <Avatar icon="pi pi-user" size="xlarge" shape="circle" className="profile-avatar" />
//                 </div>

//                 {/* Full Name */}
//                 <div className="p-inputgroup">
//                     <span className="p-inputgroup-addon">
//                         <i className="pi pi-user" />
//                     </span>
//                     <InputText
//                         placeholder="full name"
//                         {...register("name", {
//                             required: "Full name is required",
//                             minLength: { value: 2, message: "Too short" }
//                         })}
//                         className="input-focus"
//                     />
//                 </div>
//                 {errors.name && <small style={{ color: "red" }}>{errors.name.message}</small>}

//                 {/* ID */}
//                 <div className="p-inputgroup">
//                     <span className="p-inputgroup-addon">
//                         <i className="pi pi-id-card" />
//                     </span>
//                     <InputText
//                         placeholder="id"
//                         {...register("userId", {
//                             required: "ID is required",
//                             minLength: { value: 9, message: "Must be 9 digits" },
//                             maxLength: { value: 9, message: "Must be 9 digits" },
//                             pattern: { value: /^[0-9]+$/, message: "Numbers only" }
//                         })}
//                         className="input-focus"
//                     />
//                 </div>
//                 {errors.userId && <small style={{ color: "red" }}>{errors.userId.message}</small>}

//                 {/* Phone */}
//                 <div className="p-inputgroup">
//                     <span className="p-inputgroup-addon">
//                         <i className="pi pi-phone" />
//                     </span>
//                     <InputText
//                         placeholder="phone"
//                         {...register("phone", {
//                             required: "Phone is required",
//                             pattern: { value: /^[0-9\-+()\s]+$/, message: "Invalid format" },
//                             maxLength: { value: 20, message: "Too long" }
//                         })}
//                         className="input-focus"
//                     />
//                 </div>
//                 {errors.phone && <small style={{ color: "red" }}>{errors.phone.message}</small>}

//                 {/* Address */}
//                 <div className="p-inputgroup">
//                     <span className="p-inputgroup-addon">
//                         <i className="pi pi-map-marker" />
//                     </span>
//                     <InputText
//                         placeholder="address"
//                         {...register("address")}
//                         className="input-focus"
//                     />
//                 </div>

//                 {/* Email */}
//                 <div className="p-inputgroup">
//                     <span className="p-inputgroup-addon">
//                         <i className="pi pi-envelope" />
//                     </span>
//                     <InputText
//                         placeholder="email"
//                         {...register("email", {
//                             required: "Email is required",
//                             pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" }
//                         })}
//                         className="input-focus"
//                     />
//                 </div>
//                 {errors.email && <small style={{ color: "red" }}>{errors.email.message}</small>}

//                 {/* Project Dropdown */}
//                 <div className="p-inputgroup">
//                     <span className="p-inputgroup-addon">
//                         <i className="pi pi-briefcase" />
//                     </span>
//                     <Dropdown
//                         value={selectedProject}
//                         onChange={(e) => setSelectedProject(e.value)}
//                         options={projects}
//                         optionLabel="name"
//                         placeholder="project"
//                         className="w-full md:w-14rem input-focus"
//                     />
//                 </div>
//                 {!selectedProject && <small style={{ color: "red" }}>Project is required</small>}

//                 <Button type="submit" label="save" className="p-button-outlined save-btn" />
//             </form>
//         </div>
//     );
// }
// export default AddForm;