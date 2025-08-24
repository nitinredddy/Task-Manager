import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.json())



import { userRouter } from './routes/user.routes.js'
import { taskRouter } from './routes/task.routes.js'

app.use("/api/v1/user",userRouter)
app.use("/api/v1/task",taskRouter)


export {app}
