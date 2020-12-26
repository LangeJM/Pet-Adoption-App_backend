const mongoose = require('mongoose');

mongoose
    .connect('***REMOVED***', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => {
        console.error('Connection error', error.message);
    });

// mongoose
//     .connect('mongodb://127.0.0.1:27017/I-Pets', { useNewUrlParser: true, useUnifiedTopology: true })
//     .catch(error => {
//         console.error('Connection error', error.message);
//     });

const db = mongoose.connection;

module.exports = db  



// const connectionString = `***REMOVED***<password>@cluster0.jsqud.mongodb.net/<dbname>?retryWrites=true&w=majority`


/*
const MongoClient = require('mongodb').MongoClient;
const uri = "***REMOVED***<password>@cluster0.jsqud.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/