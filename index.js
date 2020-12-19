const express = require('express')
// const bodyParser = require('body-parser') // comes again bundled with express 
const cors = require('cors')

const db = require('./db/db')
const userRouter = require('./routes/user-router')

const app = express()
const apiPort = 5000

// app.use(bodyParser.urlencoded({ extended: true })) // Use below instead
// app.use(express.urlencoded())
app.use(cors())
// app.use(bodyParser.json()) // Use below instead
app.use(express.json())

db.on('error', console.error.bind(console.log, 'MongoDB connection error:')) // Better implementation than bind?

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use('/api', userRouter)

app.listen(apiPort, () => {
    console.log(`Server running on port ${apiPort}`)
});
