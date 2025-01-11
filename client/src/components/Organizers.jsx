import { useEffect } from "react"
import { useLocation } from "react-router-dom";
import axios from 'axios'
import ShowReceiverToOrganizer from './ShowReceiverToOrganizer'
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';             
import 'primeicons/primeicons.css';                      

const Organizers = (props) => {

    const location = useLocation();
    const userId = location.state || {}
    const [receiversData, setReceiversData] = useState([])
    const [organizer, setOrganizer] = useState({})
    const [visible, setVisible] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    // const token = JSON.parse(localStorage.getItem('token')) || ""
       const token = JSON.parse(localStorage.getItem('token')) || ""

    const getData = async () => {
        try {
            console.log("aaaaaaaa");
            const res = await axios.get(`http://localhost:3005/api/receiver/getReceivers/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setReceiversData(res.data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const onSubmit = async (data) => {
        const receiver={...data,organizerUserId:userId}
        try {
            const res = await axios.post("http://localhost:3005/api/receiver/addReceiver", receiver, {
                headers: { Authorization: `Bearer ${token}` }})
            if (res.status === 200) {
                setReceiversData(res.data)
            }
        } catch (err) {
            console.error(err)
        }
        setVisible(false); 
        reset(); 
    }

    useEffect(() => {
        getData()
    }, [])
    return (
        <>
            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                {
                    receiversData.length > 0 && receiversData.map(receiver => (<ShowReceiverToOrganizer key={receiver.user._id.toString()} user={receiver.user} receiver={receiver.receiver} setReceiversData={setReceiversData} />))
                }
            </div>

            <div>
                <Button label="Add Client" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                <Dialog
                    header="Add Client"
                    visible={visible}
                    style={{ width: '400px' }}
                    modal
                    onHide={() => setVisible(false)}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <label htmlFor="name">Full Name</label>
                            <InputText id="name" {...register('name', { required: 'שדה חובה' })} className={errors.name ? 'p-invalid' : ''} />
                            {errors.name && <small className="p-error">{errors.name.message}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="userId">ID</label>
                            <InputText id="userId" {...register('userId', { required: 'שדה חובה' })}
                                className={errors.userId ? 'p-invalid' : ''}
                            />
                            {errors.userId && <small className="p-error">{errors.userId.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <InputText id="password" type="password" {...register('password', {
                                required: 'שדה חובה',
                                minLength: { value: 6, message: 'סיסמה חייבת להיות באורך של לפחות 6 תווים' }
                            })}
                                className={errors.password ? 'p-invalid' : ''}
                            />
                            {errors.password && <small className="p-error">{errors.password.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="address">Address</label>
                            <InputText id="address" {...register('address')}
                                className={errors.address ? 'p-invalid' : ''}
                            />
                            {errors.address && <small className="p-error">{errors.address.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText defaultValue="aaa@gmail.com" {...register("email", { required: true,pattern: { value: /^\S+@\S+\.\S+$/, message: 'not correct email' } })} className="input-focus" />
                            {errors.email && <small className="p-error">{errors.email.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="phone">Phone</label>
                            <InputText id="phone" {...register('phone')}
                                className={errors.phone ? 'p-invalid' : ''}
                            />
                            {errors.phone && <small className="p-error">{errors.phone.message}</small>}
                        </div>
                        <div className="p-mt-3">
                            <Button type="submit" label="Add" className="p-button-success" />
                            <Button type="button" label="Cancle" className="p-button-secondary p-ml-2" onClick={() => setVisible(false)} />
                        </div>
                    </form>
                </Dialog>
            </div>
        </>
    )
}
export default Organizers