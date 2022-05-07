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


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.te6vn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("carspot").collection("service");
    app.get('/service',async(req,res)=>{
    const query ={}
    const cursor = serviceCollection.find(query)
    const services = await cursor.toArray();
    res.send(services)
    })
    console.log("connected")

  } finally {
   
    
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})