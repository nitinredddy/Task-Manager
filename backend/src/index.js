import { connectDB } from "./db/index.db.js";
import dotenv from 'dotenv'
import { app } from "./app.js";

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.on("error",(err)=>{
        console.log("some error occurred",err)
        throw err
    })
    app.listen(process.env.PORT || 3000,()=>{
        console.log("Server listening on port",process.env.PORT)
    })
}).catch((error)=>{
    console.log("MongoDB connection failed !!! ",error)
})
