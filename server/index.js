import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import connectToDB from './db/connectToDb.js'

import authRoutes from './routes/auth.routes.js'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth/user", authRoutes)

app.get('/', (req, res) => res.json({ message: "This is Server Home Page" }))


app.listen(process.env.PORT, () => {
    connectToDB()
    console.log(`Server listening on port ${process.env.PORT}`)
})