import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import axios from "axios";
import io from 'socket.io-client';
import { InputText } from 'primereact';
import { Dialog } from "primereact/dialog";
import { ScrollPanel } from "primereact/scrollpanel";

const TaskPage = (props) => {

    const id = props.id || {}
    const managers = props.managers || {}
    const tasks = props.tasks || {}
    const setTasks = props.setTasks || {}
    const client = props.client || {}
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visibleOptions,setVisibleOptions]=useState(false)
    /*chat*/
    const [visible, setVisible] = useState(false)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null)
    const [selectedManager,setSelectedManager]=useState({managerId:{name:''}})

    const socket = io('http://localhost:3005');

    useEffect(() => {
        const socket = io('http://localhost:3005');

        // קבלת הודעות ישנות כאשר המטופל מתחבר
        socket.on('previousMessages', (msgs) => {
            setMessages(msgs.filter((message)=>{return (message.senderId === id && message.receiverId===selectedManager.managerId._id) || (message.senderId === selectedManager.managerId._id && message.receiverId===id)}));
        });

        // קבלת הודעה חדשה מהקלינאית
        socket.on('newMessage', (message) => {
            if ((message.senderId === id && message.receiverId===selectedManager.managerId._id) || (message.senderId === selectedManager.managerId._id && message.receiverId===id)) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        socket.on('connect_timeout', (timeout) => {
            console.error('Socket connection timeout:', timeout);
        });

        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });

        return () => {
            socket.disconnect();
        };
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [visible]);

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            const message = {
                sender: client.name,
                senderId: id,
                receiverId:selectedManager.managerId._id,
                content: newMessage,
                timestamp: new Date().toLocaleTimeString(),
            };
            socket.emit('sendMessage', message);
            setNewMessage('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    /*chat*/

    

    const today = new Date().toDateString();
    const isToday = selectedDate.toDateString() === today;

    const updateTask = (taskId, field, value) => {
        setTasks(tasks.map(task => task.id === taskId ? { ...task, [field]: value } : task));
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-IL', options);
    };

   
    return (
        <>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-3">My Tasks</h2>
                <div className="flex flex-col items-center mb-4">
                    <h3 className="text-2xl font-semibold mb-2">{formatDate(selectedDate)}</h3>
                </div>
                <div className="flex justify-between mb-3">
                    <Button
                        icon="pi pi-chevron-left"
                        onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                    />
                    <Button
                        icon="pi pi-chevron-right"
                        onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                    />
                </div>

                <DataTable value={
                    tasks.filter((task) => {
                        const taskDate = new Date(task.date);
                        return (
                            taskDate.getFullYear() === selectedDate.getFullYear() &&
                            taskDate.getMonth() === selectedDate.getMonth() &&
                            taskDate.getDate() === selectedDate.getDate()
                        );
                    })
                } className="mt-3">
                    <Column field="title" header="Task" />
                    <Column field="description" header="Description" />
                    <Column
                        header="Completed"
                        body={(rowData) => (
                            <Checkbox
                                checked={rowData.completed}
                                onChange={(e) => updateTask(rowData.id, "completed", e.checked)}
                                disabled={!isToday}
                            />
                        )}
                    />
                    <Column
                        header="Rating"
                        body={(rowData) => (
                            <Rating
                                value={rowData.rating}
                                cancel={false}
                                onChange={(e) => updateTask(rowData.id, "rating", e.value)}
                                disabled={!isToday}
                            />
                        )}
                    />
                </DataTable>
            </div>
            <Button
                icon="pi pi-comment"
                className="p-button-rounded p-button-text p-button-secondary custom-icon-button"
                onClick={() => { setVisibleOptions(true) }}
                style={{
                    zIndex: 9999,
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    border: '2px solid rgb(13, 124, 26)',
                    backgroundColor: '#f0f0f0',
                    color: 'rgb(13, 124, 26)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            />

            <Dialog
                header={`Chat With ${selectedManager.managerId.name}`}
                visible={visible}
                position="bottom-right"
                style={{ width: '350px', height: '60vh', bottom: '60px' }}
                onHide={() => setVisible(false)}
                draggable={false}
                resizable={false}
            >
                <ScrollPanel style={{ flex: '1', overflowY: 'auto', marginBottom: '10px' }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {`${msg.timestamp}`}
                            <div style={{
                                padding: "5%",
                                backgroundColor: msg.sender === client.name ? '#dcdcdc' : '#f5f5f5', // אפור מאוד בהיר ואפור בהיר
                                borderRadius: "5px" // פינות פחות מעוגלות
                            }}>
                                {`${msg.sender}: ${msg.content}`}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </ScrollPanel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InputText
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type Your Message..."
                        style={{ flex: '1', marginRight: '10px' }}
                    />
                    <Button label="Send" onClick={sendMessage} />
                </div>
            </Dialog>

             <Dialog
                header="Pick a manager"
                visible={visibleOptions}
                position="bottom-right"
                style={{ width: '350px', height: '60vh' ,bottom: '60px'}}
                onHide={() => setVisibleOptions(false)}
                draggable={false}
                resizable={false}
            >
                <ScrollPanel style={{ flex: '1', overflowY: 'auto', marginBottom: '10px' }}>
                    {managers.map((manager, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <div onClick={()=>{
                                setVisibleOptions(false);
                                setSelectedManager(manager);
                                setVisible(true);
                            }} style={{
                                padding: "5%",
                                backgroundColor:'#f5f5f5', 
                                borderRadius: "5px",
                                cursor:'pointer'
                            }}>
                                {`${manager.managerId.name}`}
                            </div>
                        </div>
                    ))}
                </ScrollPanel>
               
            </Dialog>
        </>
    );
};

export default TaskPage;