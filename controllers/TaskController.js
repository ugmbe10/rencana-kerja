import express from 'express'
import Task from './../models/task.js'

const taskRouter = express.Router()

taskRouter.use(express.json())

export default taskRouter