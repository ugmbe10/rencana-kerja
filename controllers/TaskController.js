import express from 'express';
import Task from '../models/task.js';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import Conf from './../utils/config.js';

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

        if(task){
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

        if(task){
            if(!task.assigned_to){
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

export default taskRouter;