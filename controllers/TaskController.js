import express from 'express';
import Task from '../models/task.js';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import Conf from './../utils/config.js';
import Status from './../utils/status.js';

const taskRouter = express.Router();

taskRouter.use(bodyParser.urlencoded({ extended: false }));
taskRouter.use(bodyParser.json());

taskRouter.put('/update-status/:id', async(req, res) =>{
    
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
                message: 'Failed to authenticate token.' });
        const username = decoded.user.username;

        if(task){
            if(task.status === Status[0]){
                task.assigned_to = username;
            } 
            task.status = status;

            const updatedTask = await task.save();
            res.status(200).send(updatedTask);
        }
        res.status(404).json({
            message: 'Task tidak ditemukan'
        });
    });
    
});

taskRouter.delete('/delete/:id', async(req, res) => {
    const task = await Task.findById(req.params.id);

    if(task){
        if(!task.assigned_to || task.assigned_to===null || task.assigned_to===""){
            await task.remove();
            res.json({
                message: 'Task terhapus'
            });
        }
        res.json({
            message: 'Task tidak bisa dihapus'
        });
    } else {
        res.status(404).json({
            message: 'Task tidak ditemukan'
        });
    };
});

export default taskRouter;