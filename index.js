import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import userRouter from './controllers/UserController.js'
import taskRouter from './controllers/TaskController.js'

import dotenv from 'dotenv'
dotenv.config()

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    console.log('Connect to MongoDB database success!')
}).catch(err => {
    console.log('Failed to connect to MongoDB database')
    console.log(err)
})

app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Sukses terhubung!'})
})

// Endpoint untuk mengakses UserController.js
app.use('/api/user', userRouter)
// Endpoint untuk mengakses TaskController.js
app.use('/api/task', taskRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listens on port ${port}`)
})
