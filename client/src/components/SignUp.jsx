import { useForm } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async(data) => {
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <Card title="Task Track" subTitle="Sign Up" className="md:w-30rem custom-card p-card-subtitle">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Full Name</label>
                                <InputText {...register("name",{ required:true})} className="input-focus" /> 
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">ID</label>
                                <InputText {...register("userId", { required: true ,maxLength:9,minLength:9 })} className="input-focus" />
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Password</label>
                                <InputText {...register("password", { required: true })} className="input-focus" />
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Email</label>
                                <InputText defaultValue="aaa@gmail.com" {...register("email", { required: true,pattern: { value: /^\S+@\S+\.\S+$/, message: 'not correct email' } })} className="input-focus" />
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Phone</label>
                                <InputText {...register("phone",{maxLength: 20 })} className="input-focus" />
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Address</label>
                                <InputText {...register("address")} className="input-focus" />
                            </div>
                            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                                <label className="w-6rem">Project Name</label>
                                <InputText {...register("projectName")} className="input-focus" />
                            </div>
                            {errors.exampleRequired && <span>This field is required</span>}
                            <input type="submit" />
                        </div>
                    </form>
                </Card>
            </div>
        </>

    )
}
export default SignUp