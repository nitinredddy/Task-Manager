import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiError.js";
import { ApiError } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";

const createATask = asyncHandler(async(req,res)=>{
    const {title,description,status,priority,duedate} = req.body

    if(!title){
        throw new ApiError(400,"Please enter a title for the task")
    }

    const task = await Task.create({
        creator:req.user._id,
        title:title,
        description:description,
        duedate:duedate,
        status:status,
        priority:priority
    })

    return res
    .status(200)
    .json(new ApiResponse(200,task,"Task created successfully"))
})

const update = asyncHandler(async(req,res)=>{
    const {taskId} = req.params
    const {title,description,status,priority,duedate} = req.body
    if(!taskId || taskId==""){
        throw new ApiError(400,"Give a valid task id")
    }

    const task = await Task.findById(taskId)

    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) {
    const validStatuses = ["todo", "in-progress", "done"];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }
    task.status = status;
    }
    if (priority) {
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(priority)) {
        throw new ApiError(400, "Invalid priority value");
    }
    task.priority = priority;
    }
    if (duedate) task.duedate = duedate;

    await task.save()

    return res
    .status(200)
    .json(new ApiResponse(200,task,"Task updated successfully"))

})

const deleteATask = asyncHandler(async(req,res)=>{
    const {taskId} = req.params

    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }
    
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
        throw new ApiError(404, "Task not found");
    }

    return res 
    .status(200)
    .json(new ApiResponse(200,null,"Task deleted successfully"))
})

const getAllUserTasks = asyncHandler(async(req,res)=>{
    const tasks = await Task.find({creator:req.user._id}).sort({createdAt:-1})

    return res
    .status(200)
    .json(new ApiResponse(200,tasks,"User tasks fetched successfully"))
})

export {createATask,update,deleteATask,getAllUserTasks}