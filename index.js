const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World! from shishir')
})


const uri = "mongodb+srv://dbcarspot:wQ1TDioe1niXdGEp@cluster0.te6vn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("db connected")
  // perform actions on the collection object
  client.close();
});


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})