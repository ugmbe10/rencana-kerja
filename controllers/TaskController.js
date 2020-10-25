import express from 'express';
import Task from './../models/task.js';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import Conf from './../utils/config.js';

const taskRouter = express.Router();
taskRouter.use(bodyParser.urlencoded({ extended: false }));
taskRouter.use(express.json());

//@route POST input/input-task Task
taskRouter.post('/input-task', async(req, res, next) => {
    try {
        const { task_name, status, assigned_to } = req.body
        const findTask = await Task.findOne({ task_name })
        if (findTask) {
            res.status(201).json({ message: 'Task sudah ada!' })
        } else {
            const task = new Task({
                task_name,
                status,
                assigned_to
            })

            const createdTask = await task.save()
            res.status(200).json(createdTask)
        }

    } catch (error) {
        res.status(500).json({ error: 'Task creation failed' })
        throw error
    }
})

//@route GET all-task
taskRouter.get('/all-task', async(req, res, next) => {
    const tasks = await Task.find({})

    if (tasks != null) {
        res.status(200).json(tasks)
    } else {
        res.json({
            message: 'Task log is empty, Input task first!'
        })

    }
})

//@route GET task with "do/in progess/done" status
taskRouter.get('/:stat', async(req, res, next) => {
    const tasks = await Task.find({ status: req.params.stat })

    if (tasks != null) {
        res.status(200).json(tasks)
    } else {
        res.json({
            message: "Task Status " + req.params.stat + " log is empty!"
        })

    }
})

//@route PUT assigned_to task
taskRouter.put('/assigned-to/:id', async(req, res) => {

    const task = await Task.findById(req.params.id);

    const { assigned_to } = req.body;
    //mengambil token dari header
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, async(err, decoded) => {
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

        if (task) {
            task.assigned_to = assigned_to;
            task.status = 'do';
            const assignedTask = await task.save();
            res.status(200).send(assignedTask);
        }
        res.status(404).json({
            message: 'Task tidak ditemukan'
        });
    });

});


//@route PUT update status task
taskRouter.put('/update-status/:id', async(req, res) => {

    const task = await Task.findById(req.params.id);

    const { status } = req.body;
    //mengambil token dari header
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, async(err, decoded) => {
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

        if (task) {
            task.status = status;
            const updatedTask = await task.save();
            res.status(200).send(updatedTask);
        }
        res.status(404).json({
            message: 'Task tidak ditemukan'
        });
    });

});

//@route DELETE task by task id
taskRouter.delete('/delete/:id', async(req, res) => {
    const task = await Task.findById(req.params.id);

    //mengambil token dari header
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, async(err, decoded) => {
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

        if (task) {
            if (!task.assigned_to) {
                res.json({
                    message: 'Task tidak bisa dihapus'
                });
            } else {
                await task.remove();
                res.json({
                    message: 'Task terhapus'
                });
            }
        } else {
            res.status(404).json({
                message: 'Task tidak ditemukan'
            });
        }
    })
})

export default taskRouter