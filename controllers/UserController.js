import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Conf from './../utils/config.js'
import User from './../models/user.js'

//import dotenv from 'dotenv'
//dotenv.config()

const userRouter = express.Router()
// Proses parsing cukup menggunakan express, ngga perlu pakai
// Body Parser. Kata mas Wisnu gitu pas aku tanya di Github
userRouter.use(express.json())

// Cek validasi token
userRouter.get('/validate', function(req, res) {
   // Header yang digunakan untuk mengambil token
   var token = req.headers['x-access-token']
   if (!token) 
      return res.status(401).send({ auth: false, message: 'No token provided!' })
   
   // Verifikasi token dengan JWT
   jwt.verify(token, Conf.secret, function(err, decoded) {
      if (err) 
         return res.status(500).send({ auth: false, message: 'Failed to authenticate token!' })
   
   res.status(200).send(decoded)
   })
})

// Buat user baru
userRouter.post ('/sign-up', async (req, res) => {
   try {
      const { username, password } = req.body
      const findUser = await User.findOne({ username })
       
      if(findUser){
         res.status(201).json({ message: 'Username sudah ada!' })
      } else {
         var saltRounds = 5
         const hashedPassword = await bcrypt.hash(password, saltRounds)
                           
         const createdUser = new User({
            "username": username,
            "password": hashedPassword
         })

         const savedUser = await createdUser.save()
         res.status(201).json(savedUser)
      }
   } catch (error) {
      res.status(500).json({ error: error })
   }
})

// Login untuk mendapatkan access token agar bisa melakukan kegiatan terkait Task
userRouter.post('/login', async(req, res) => {
   try {
      const { username, password } = req.body

      const currentUser = await new Promise((resolve, reject) => {
         User.find({ 'username': username }, (err, user) => {
            if(err) reject(err);
            resolve(user);
         })
      })

      if(currentUser[0]){
         // Jika username terdaftar, cek apakah password yang di-inputkan benar
         bcrypt.compare(password, currentUser[0].password).then((result, err) => {
            if(result) {
               // Jika ada error saat komparasi password
               if (err) return res.status(500).send('Terdapat masalah ketika login')
               
               // Buat tokennya
               const user = currentUser[0]
               var token = jwt.sign({ user }, Conf.secret, {
                  expiresIn: 1800 // Dalam detik (30 menit)
               })
               
               res.status(200).send({ auth: true, 'status': 'Berhasil login!', token: token})
            } else {
               res.status(201).json({ 'status': 'Password salah!' })
            }
         })
      } else {
         res.status(201).json({ 'status': 'Username not found!' })
      }
   } catch (error) {
      res.status(500).json({ success: false, error: error});
   }
})

// Nanti tambahin respon endpoint lainnya disini

export default userRouter