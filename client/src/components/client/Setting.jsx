// import React, { useEffect, useState } from 'react';
// import { Card } from 'primereact/card';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Avatar } from 'primereact/avatar';
// import { TabView, TabPanel } from 'primereact/tabview';
// import { User, Mail, Phone, Lock,MapPin  } from 'lucide-react';
// import axios from 'axios';

// export default function Settings(props) {
//     const id=props.id||{}
//   const token = JSON.parse(localStorage.getItem('token')) || ""
//     const [profile, setProfile] = useState({});

// const updateUser=async()=>{
//     try {
//         const res = await axios.put(`http://localhost:3005/api/user/updateUser`,{...profile,id:profile._id},
//             { headers: { Authorization: `Bearer ${token}` } })
//         if (res.status === 200) {
//             alert("updated")
//         }
//     }
//     catch (err) {
//         console.error(err)
//     }
// }

// const changePassword = async()=>{
//     try {
//         const res = await axios.put(`http://localhost:3005/api/user/changePassword`,{id:profile._id,password:profile.password,newPassword:profile.newPassword},
//             { headers: { Authorization: `Bearer ${token}` } })
//         if (res.status === 200) {
//             alert("updated")
//         }
//     }
//     catch (err) {
//         console.error(err)
//     }
// }
//     const getManager=async()=>{
//         try {
//             const res = await axios.get(`http://localhost:3005/api/user/getUser/${id}`,
//                 { headers: { Authorization: `Bearer ${token}` } })
//             if (res.status === 200) {
//                 setProfile({...res.data})
//             }
//         }
//         catch (err) {
//             console.error(err)
//         }
//     }

    
//     useEffect(() => {
//       getManager()
//     }, [])
    

//     const handleChange = (e) => {
//         setProfile({ ...profile, [e.target.name]: e.target.value });
//     };

//     return (
//         <div className="max-w-2xl mx-auto py-10 card">
//             <Card className="text-center">
//                 <Avatar style={{ transform: 'scale(1.5)' }} image={profile.imageUrl} size="xlarge" shape="circle" className="mx-auto mb-4" icon="pi pi-user" />
//                 <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
//             </Card>

//             <TabView className="mt-6">
//                 <TabPanel header="General" >
//                     <Card>
//                         <div className="p-6">
//                             <div className="flex align-items-center mb-4">
//                                 <User size={18} className="mr-2" />
//                                 <InputText name="name" value={profile.name} onChange={handleChange} style={{ width: '50%' }} />
//                             </div>
//                             <div className="flex align-items-center mb-4">
//                                 <Mail size={18} className="mr-2" />
//                                 <InputText name="email" value={profile.email} onChange={handleChange} style={{ width: '50%' }} />
//                             </div>
//                             <div className="flex align-items-center mb-4">
//                                 <Phone size={18} className="mr-2" />
//                                 <InputText name="phone" value={profile.phone} onChange={handleChange} style={{ width: '50%' }}  />
//                             </div>
//                             <div className="flex align-items-center mb-4">
//                                 <MapPin  size={18} className="mr-2" />
//                                 <InputText name="address" value={profile.address} onChange={handleChange} style={{ width: '50%' }}  />
//                             </div>
//                             <Button onClick={()=>{updateUser()}} label="Save Changes" style={{ width: '20%', marginLeft:'2.3%',color: "green", background: "white", border: '1px solid green'}} className="input-focus" />
//                         </div>
//                     </Card>
//                 </TabPanel>

//                 <TabPanel header="Security" >
//                     <Card>
//                         <div className="p-6">
//                             <div className="flex align-items-center mb-4" >
//                                 <Lock size={18} className="mr-2" />
//                                 <InputText type="password" placeholder="Old Password" name="password" onChange={handleChange} style={{ width: '50%'}} />
//                             </div>
//                             <div className="flex align-items-center mb-4" >
//                                 <Lock size={18} className="mr-2" />
//                                 <InputText type="password" placeholder="New Password" name="newPassword" onChange={handleChange} style={{ width: '50%'}} />
//                             </div>
//                             <Button label="Update Password" onClick={()=>{changePassword()}} style={{ width: '20%', marginLeft:'2.3%',color: "green", background: "white", border: '1px solid green'}} className="input-focus"/>
//                         </div>
//                     </Card>
//                 </TabPanel>
//             </TabView>
//         </div>
//     );
// }