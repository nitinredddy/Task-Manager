import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:['to-do','in-progress','completed'],
        default:'to-do'
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'medium'
    },
    duedate:{
        type:Date
    }
},{timestamps:true})

export const Task = mongoose.model("Task",taskSchema)