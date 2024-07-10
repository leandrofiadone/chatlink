import express from 'express'
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route"
import messageRoutes from "./routes/message.route"

import dotenv from "dotenv"

dotenv.config()


const app = express ();

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

// app.get('/', (req,res)=>{
//     res.send('Hello World!');
// })

const port = 5000

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

//TODO Add Socket.io to the server
//TODO Configure this server for deployment

