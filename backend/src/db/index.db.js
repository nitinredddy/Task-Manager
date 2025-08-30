import mongoose from 'mongoose'

const DB_NAME = 'Main'

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Mongodb connected, Host:",connectionInstance.connection.host)
    } catch (error) {
        console.log("Some problem occurred",error)
        process.exit(1)
    }
}

export {connectDB}