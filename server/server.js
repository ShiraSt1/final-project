require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
connectDB();
const app = express();

/* socket */
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });
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

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/user", require("./routes/user"));
app.use("/api/task", require("./routes/task"));
app.use("/api/login", require("./routes/login"));
app.use("/api/project", require("./routes/project"));

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



















// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const corsOptions = require("./config/corsOptions");
// const connectDB = require("./config/dbConn");
// connectDB();
// const app = express();

// /* socket */
// const http = require('http');
// const socketIo = require('socket.io');
// const server = http.createServer(app);
// const io = socketIo(server);
// /* socket */

// const PORT = process.env.PORT || 2004;
// const cors = require("cors");

// // אפשרות לשמירת קבצים גדולים יותר
// const bodyParser = require('body-parser');
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// // אפשרות לשמירת קבצים גדולים יותר

// app.use(cors(corsOptions));
// app.use(express.json());
// app.use("/api/user", require("./routes/user"));
// app.use("/api/task", require("./routes/task"));
// app.use("/api/login", require("./routes/login"));
// app.use("/api/project", require("./routes/project"));

// mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB');
    
//     // Start the server on the specified port
//     server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });

// mongoose.connection.on('error', err => {
//     console.log(err);
// });

// /* socket */
// // שדרוג הודעות בין המשתמשים
// let messages = [];

// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);
    
//     // שליחה של כל ההודעות הקודמות למטופל/קלינאית בעת התחברות
//     socket.emit('previousMessages', messages);

//     // קבלה ושליחה של הודעות
//     socket.on('sendMessage', (message) => {
//         messages.push(message); // שמירה על ההודעה
//         io.emit('newMessage', message); // שידור ההודעה לכל המחוברים
//     });

//     // התנתקות
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// /* socket - Server runs on the same port as Express */
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
// /* socket */



















// require("dotenv").config()
// const express = require("express")
// const mongoose = require("mongoose")
// const corsOptions = require("./config/corsOptions")
// const connectDB = require("./config/dbConn")
// connectDB()
// const app = express()

// /* socket */
// const http = require('http');
// const socketIo = require('socket.io');
// const server = http.createServer(app);
// const io = socketIo(server);
// /* socket */

// const PORT = process.env.PORT || 2004
// const cors = require("cors")

// /*אפשרות לשמירת קבצים גדולים יותר*/ 
// const bodyParser = require('body-parser');
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// /*אפשרות לשמירת קבצים גדולים יותר*/ 

// app.use(cors(corsOptions))
// app.use(express.json())
// app.use("/api/user", require("./routes/user"))
// app.use("/api/task", require("./routes/task"))
// app.use("/api/login", require("./routes/login"))
// app.use("/api/project", require("./routes/project"))

// mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB')
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
// })
// mongoose.connection.on('error', err => {
//     console.log(err)
// })


// /*socket */
// // שדרוג הודעות בין המשתמשים
// let messages = [];

// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);
    
//     // שליחה של כל ההודעות הקודמות למטופל/קלינאית בעת התחברות
//     socket.emit('previousMessages', messages);

//     // קבלה ושליחה של הודעות
//     socket.on('sendMessage', (message) => {
//         messages.push(message); // שמירה על ההודעה
//         io.emit('newMessage', message); // שידור ההודעה לכל המחוברים
//     });

//     // התנתקות
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// // הגדרת השרת לפורט 4000
// server.listen(4000, () => {
//     console.log('Server is running on port 4000');
// });
// /*socket*/