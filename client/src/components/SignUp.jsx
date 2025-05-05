import { useForm } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import logo from "../pictures/logo.jpg"
import { Toast } from 'primereact/toast';
import { useRef } from "react";

const SignUp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const toast = useRef(null);

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:3005/api/user/addManager', data)
            if (res.status === 200) {
                navigate(`../`)
            }
        } catch (e) {
             toast.current.show({severity:'error', summary: 'Error', detail:e.response.data, life: 3000});
        }
    }
    return (
        <>
        <Toast ref={toast} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card className="md:w-30rem custom-card p-card-subtitle">
                    <div className="card-title">
                        <img src={logo} alt="logo" className="card-icon" />
                        <h1>Task Track</h1>
                    </div>
                    <h2 style={{ marginTop: "0px", marginBottom: "30px" }}>Sign Up</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Full Name</label>
                                <InputText required {...register("name")} className="input-focus" />
                            </div>
                            <div>
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">ID</label>
                                <InputText required className="input-focus" {...register("userId", {
                                    minLength: { value: 9, message: "ID must be exactly 9 digits" },
                                    maxLength: { value: 9, message: "ID must be exactly 9 digits" },
                                    pattern: { value: /^[0-9]+$/, message: "ID must contain only numbers" }
                                })} />
                            </div>
                            <div>
                                {errors.userId && <span style={{ color: "red" }}>{errors.userId.message}</span>}
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Password</label>
                                <InputText required {...register("password")} type="password" className="input-focus" />
                            </div>
                            <div>
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Email</label>
                                <InputText required type='email' defaultValue="aaa@gmail.com" {...register("email")} className="input-focus" />
                            </div>
                            <div>
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Phone</label>
                                <InputText {...register("phone", { maxLength: 20})} required className="input-focus" />
                            </div>
                            <div>
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Address</label>
                                <InputText {...register("address")} className="input-focus" />
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Project Name</label>
                                <InputText required {...register("projectName")} className="input-focus" />
                            </div>
                            <div>
                            </div>
                            <input type="submit" value="Sign In" class="custom-button" />
                        </div>
                    </form>
                </Card>
            </div>
        </>

    )
}
export default SignUp