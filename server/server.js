require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
connectDB()
const app = express()
const PORT = process.env.PORT || 2004
const cors = require("cors")

app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/organizer", require("./routes/organizer"))
app.use("/api/receiver", require("./routes/receiver"))
app.use("/api/task", require("./routes/task"))
app.use("/api/login", require("./routes/login"))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})