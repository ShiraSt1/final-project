import { Button } from "primereact/button"
import { Divider } from "primereact/divider"

const DetailsTask = (props) => {
    const task = props.selectedTask || {}
    const setShowDetails = props.setShowDetails || {}

    return (
        <>
            <div className="text-sm text-gray-700 mb-3" style={{ width: "50%" }}>
                <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-text"
                    style={{
                        color: "black",
                    }}
                    onClick={() => setShowDetails(false)}
                />
                <Divider />
                <p><strong>Title:</strong> {task.title}</p>
                <Divider />

                <p><strong>Description:</strong> {task.description || 'no description'}</p>
                <Divider />
                <p><strong>Difficulty:</strong> {task.difficulty || 'no difficulty'}</p>

                <Divider />
                <p><strong>Comment:</strong> {task.comment || 'no comment'}</p>

                {task.file && (
                    <>
                        <Divider />
                        <div className="flex items-center gap-3">
                            <i className="pi pi-file" style={{ fontSize: '1.5rem' }}></i>
                            <div className="flex-1">
                                <p className="m-0 text-sm font-medium">{task.file.fileName}</p>
                                <p className="m-0 text-xs text-gray-500">
                                    {(task.file.fileSize / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <a href={task.file.filePath} download>
                             
                                <Button icon="pi pi-download" text tooltip="download file" />
                            </a>
                            <Button
                                icon="pi pi-eye"
                                text
                                tooltip="watch"
                                onClick={() => window.open(`http://localhost:3005/${task.file.filePath}`, '_blank')}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
export default DetailsTask