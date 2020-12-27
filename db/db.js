const mongoose = require('mongoose');

mongoose
    .connect(process.env.mongoDBAuthString, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => {
        console.error('Connection error', error.message);
    }); // Need to add closure of connection???

const db = mongoose.connection;

module.exports = db  

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