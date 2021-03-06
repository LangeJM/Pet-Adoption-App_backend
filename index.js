require('dotenv').config()

const express = require('express')
const cors = require('cors')

const db = require('./db/db')
const userRouter = require('./routes/user-router')
const petRouter = require('./routes/pet-router')

const app = express()
const apiPort = 5000

app.use(cors())
app.use(express.json())

app.use('/public', express.static('public'));

db.on('error', console.error.bind(console.log, 'MongoDB connection error:')) // Is there a better implementation than bind? Arrow function? 

app.use('/api', userRouter)
app.use('/api', petRouter)

app.listen(apiPort, () => {
    console.log(`Server running on port ${apiPort}`)
});
