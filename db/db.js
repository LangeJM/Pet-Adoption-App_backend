const mongoose = require('mongoose');

mongoose
    .connect(process.env.mongoDBAuthString, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => {
        console.error('Connection error', error.message);
    }); // Need to add closure of connection???

const db = mongoose.connection;

module.exports = db  
