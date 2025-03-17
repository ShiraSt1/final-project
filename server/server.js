require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
connectDB()
const app = express()
const PORT = process.env.PORT || 2004
const cors = require("cors")
/**/ 
const bodyParser = require('body-parser');

// Increase limit size
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/** */
app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/user", require("./routes/user"))
app.use("/api/task", require("./routes/task"))
app.use("/api/login", require("./routes/login"))
app.use("/api/project", require("./routes/project"))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})