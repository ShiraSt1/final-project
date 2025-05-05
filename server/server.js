require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
connectDB();
const app = express();
const path = require("path");
/* socket */
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
    transports: ['websocket', 'polling'],  // תומך ב-WebSocket ו-Polling
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
/* socket */

const PORT = process.env.PORT || 2004;
const cors = require("cors");

// אפשרות לשמירת קבצים גדולים יותר
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// אפשרות לשמירת קבצים גדולים יותר
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/user", require("./routes/user"));
app.use("/api/task", require("./routes/task"));
app.use("/api/login", require("./routes/login"));
app.use("/api/project", require("./routes/project"));
app.use("/api/email", require("./routes/emailRoutes"));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');

    // Start the server on the specified port
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
});

/* socket */
// שדרוג הודעות בין המשתמשים
let messages = [];

io.on('connection', (socket) => {
    // console.log('User connected:', socket.id);

    // שליחה של כל ההודעות הקודמות למטופל/קלינאית בעת התחברות
    socket.emit('previousMessages', messages);

    // קבלה ושליחה של הודעות
    socket.on('sendMessage', (message) => {
        
        messages.push(message);
        io.emit('newMessage', message); // שידור ההודעה לכל המחוברים
    });

    // התנתקות
    socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.id);
    });
});

/* socket - Server runs on the same port as Express */