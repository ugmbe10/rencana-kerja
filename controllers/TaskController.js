import express from 'express'
import Task from './../models/task.js'

const taskRouter = express.Router()

taskRouter.use(express.json())

//@route POST input/add Task
taskRouter.post('/addTask', async(req, res, next)=>{
    try {
        const {task_name,status, assigned_to}=req.body
        const task = new Task({
            task_name,
            status,
            assigned_to
        })

        const createdTask= await task.save()
        res.send.json(createdTask)
    } catch (error) {
        res.status(500).json({error: 'Task creation failed'})
    }
})

//@route GET all task
taskRouter.get('/task',async(req,res,next)=>{
    const tasks = await Task.find({})
    if (tasks != null) {
        res.json(tasks)
    } else {
        res.json({
            message: 'Task log is empty, Input task first!'
        })
        
    } 
})
export default taskRouter