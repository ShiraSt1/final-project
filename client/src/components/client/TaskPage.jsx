import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import axios from "axios";
import io from 'socket.io-client';
import { InputText } from 'primereact';
import { Dialog } from "primereact/dialog";
import { ScrollPanel } from "primereact/scrollpanel";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useSelector } from "react-redux";

const TaskPage = (props) => {
    const id=useSelector(x=>x.Id.id)
    const managers = props.managers || {}
    const tasks = props.tasks || {}
    const setTasks = props.setTasks || {}
    const client = props.client || {}
    const token = JSON.parse(localStorage.getItem('token')) || ""
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visibleOptions, setVisibleOptions] = useState(false)
    const [taskCompleted, setTaskCompleted] = useState({})
    const [showCompleted, setShowCompleted] = useState(false)
    /*start chat*/
    const [visible, setVisible] = useState(false)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null)
    const [selectedManager, setSelectedManager] = useState({ managerId: { name: '' } })

    const socket = io('http://localhost:3005');

    useEffect(() => {
        const socket = io('http://localhost:3005');

        // קבלת הודעות ישנות כאשר המטופל מתחבר
        socket.on('previousMessages', (msgs) => {
            setMessages(msgs.filter((message) => { return (message.senderId === id && message.receiverId === selectedManager.managerId._id) || (message.senderId === selectedManager.managerId._id && message.receiverId === id) }));
        });

        // קבלת הודעה חדשה מהקלינאית
        socket.on('newMessage', (message) => {
            if ((message.senderId === id && message.receiverId === selectedManager.managerId._id) || (message.senderId === selectedManager.managerId._id && message.receiverId === id)) {
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
                receiverId: selectedManager.managerId._id,
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
    /*end chat*/

    const today = new Date().toDateString();
    const isToday = new Date(selectedDate.toDateString()) >= new Date(today);


    const updateTask = async (task = taskCompleted) => {
        try {
            const res = await axios.put(`http://localhost:3005/api/task/completeTask`, { ...task, id: task._id, clientId: id },
                { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 200) {
                setTasks(res.data.map(newTask => {
                    return {
                        ...newTask,
                        managerName: newTask.connectionId.managerId.name,
                        projectName: newTask.connectionId.projectId.name
                    }
                }))
                setTaskCompleted({})
            }
        } catch (err) {
            console.error(err)
        }
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-IL', options);
    };


    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6 text-xl text-center">
                        <h1 claבsName="text-3xl font-bold text-gray-800 mb-2">Daily Tasks</h1>
                        <p className="text-gray-500">Hi {client.name}, here are your tasks for today 👇</p>
                    </div>

                    <div className="flex justify-between items-center mb-5">
                        <Button
                            icon="pi pi-chevron-left"
                            className="p-button-text p-button-rounded"
                            onClick={() =>
                                setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))
                            }
                        />
                        <h2 className="text-xl font-semibold text-gray-700">
                            {formatDate(selectedDate)}
                        </h2>
                        <Button
                            icon="pi pi-chevron-right"
                            className="p-button-text p-button-rounded"
                            onClick={() =>
                                setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))
                            }
                        />
                    </div>

                    <div className="shadow-md rounded-lg bg-white p-4">
                        <DataTable value={
                            tasks.filter((task) => {
                                const taskDate = new Date(task.date);
                                return (
                                    taskDate.getFullYear() === selectedDate.getFullYear() &&
                                    taskDate.getMonth() === selectedDate.getMonth() &&
                                    taskDate.getDate() === selectedDate.getDate()
                                );
                            })
                        }
                            stripedRows
                            responsiveLayout="scroll"
                            className="p-datatable-gridlines"
                        >
                            <Column field="managerName" header="Manager" style={{ minWidth: '120px' }} />
                            <Column field="projectName" header="Project" style={{ minWidth: '120px' }} />
                            <Column field="title" header="Task" style={{ minWidth: '200px' }} />
                            <Column header="Description" body={(rowData) => rowData.description ? rowData.description : 'No description'} />
                            <Column
                                header="Files"
                                body={(rowData) => (rowData.file ? (
                                    <div className="flex items-center gap-3">
                                        <i className="pi pi-file" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
                                        <div className="flex-1">
                                            <h4 className="m-0">{rowData.file?.fileName}</h4>
                                            <a href={`http://localhost:3005/${rowData.file?.filePath}`} download>
                                                <Button icon="pi pi-download" className="p-button-sm p-button-text" />
                                            </a>
                                            <Button
                                                icon="pi pi-external-link"
                                                className="p-button-sm p-button-text"
                                                onClick={() => window.open(`http://localhost:3005/${rowData.file?.filePath}`, '_blank')}

                                            />
                                            <Button
                                                icon="pi pi-print"
                                                className="p-button-sm p-button-text"
                                                onClick={() => {
                                                    const printWindow = window.open(`http://localhost:3005/${rowData.file?.filePath}`, '_blank');
                                                    if (printWindow) {
                                                        printWindow.focus();
                                                        printWindow.onload = () => {
                                                            printWindow.print();
                                                        };
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : <>No File</>
                                )}
                            />
                            <Column
                                header="Completed"
                                body={(rowData) => (
                                    <Checkbox
                                        checked={rowData.completed}
                                        onChange={(e) => {
                                            const task = { ...rowData, comment: '', difficulty: '', completed: e.checked }
                                            setTaskCompleted(task)
                                            e.checked ? setShowCompleted(true) : updateTask(task)
                                        }}
                                        disabled={!isToday}
                                    />
                                )}
                            />
                        </DataTable>
                    </div>
                </div>
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
                                backgroundColor: msg.sender === client.name ? '#dcdcdc' : '#f5f5f5',
                                borderRadius: "5px" 
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
                style={{ width: '350px', height: '60vh', bottom: '60px' }}
                onHide={() => setVisibleOptions(false)}
                draggable={false}
                resizable={false}
            >
                <ScrollPanel style={{ flex: '1', overflowY: 'auto', marginBottom: '10px' }}>
                    {managers.map((manager, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <div onClick={() => {
                                setVisibleOptions(false);
                                setSelectedManager(manager);
                                setVisible(true);
                            }} style={{
                                padding: "5%",
                                backgroundColor: '#f5f5f5',
                                borderRadius: "5px",
                                cursor: 'pointer'
                            }}>
                                {`${manager.managerId.name}-${manager.projectId.name}`}
                            </div>
                        </div>
                    ))}
                </ScrollPanel>

            </Dialog>

            <Dialog
                visible={showCompleted}
                modal
                onHide={() => { if (!showCompleted) return; setShowCompleted(false); }}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor: 'white' }}>
                        <h2 style={{textAlign:'center'}}>Do you want to respond?</h2>
                        <div className="inline-flex flex-column gap-2">
                            <Dropdown
                                value={taskCompleted.difficulty}
                                onChange={(e) => { setTaskCompleted({ ...taskCompleted, difficulty: e.value }) }}
                                options={['easy', 'medium', 'hard']}
                                placeholder="rating"
                                style={{ textAlign: 'left' }}
                                className="w-full input-focus" />
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <InputTextarea
                                value={taskCompleted.comment}
                                placeholder="write your comment here...."
                                onChange={(e) => {
                                    setTaskCompleted({ ...taskCompleted, comment: e.target.value })
                                }
                                }
                                disabled={!isToday}
                            />
                        </div>
                        <div className="flex align-items-center gap-2">
                            {(taskCompleted.comment || taskCompleted.difficulty)? 
                            <Button label="Send" onClick={(e) => {
                                hide(e); updateTask()
                            }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>:
                            <Button disabled label="Send" onClick={(e) => {
                                hide(e); updateTask()
                            }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>}
                            <Button label="No" onClick={(e) => { hide(e); updateTask() }} className="w-full input-focus" style={{ color: "green", backgroundColor: "white", border: '1px solid green' }}></Button>
                        </div>
                    </div>
                )}
            ></Dialog>
        </>
    );
};

export default TaskPage;