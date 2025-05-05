import { useForm } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import logo from "../pictures/logo.jpg"

const SignUp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:3005/api/user/addManager', data)
            if (res.status === 200) {
                navigate(`../`)
            }
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <>
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
                                <InputText {...register("name", { required: 'Name is required' })} className="input-focus" />
                            </div>
                            <div>
                                {errors.name && <span style={{ color: "red" }}>{errors.name.message}</span>}
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">ID</label>
                                <InputText className="input-focus" {...register("userId", {
                                    required: "ID is required",
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
                                <InputText {...register("password", { required: 'Password is required' })} type="password" className="input-focus" />
                            </div>
                            <div>
                                {errors.password && <span style={{ color: "red" }}>{errors.password.message}</span>}
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Email</label>
                                <InputText defaultValue="aaa@gmail.com" {...register("email", { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'not correct email' } })} className="input-focus" />
                            </div>
                            <div>
                                {errors.email && <span style={{ color: "red" }}>{errors.email.message}</span>}

                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Phone</label>
                                <InputText {...register("phone", { maxLength: 20, required: 'Phone is required' })} className="input-focus" />
                            </div>
                            <div>
                                {errors.phone && <span style={{ color: "red" }}>{errors.phone.message}</span>}
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Address</label>
                                <InputText {...register("address")} className="input-focus" />
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Project Name</label>
                                <InputText {...register("projectName", { required: 'Project is required' })} className="input-focus" />
                            </div>
                            <div>
                                {errors.projectName && <span style={{ color: "red" }}>{errors.projectName.message}</span>}
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