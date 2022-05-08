const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, CommandStartedEvent, ObjectId } = require('mongodb');
const jwt = require ('jsonwebtoken');

app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World! from shishir')
})


// --
//AUTH
app.get('/hero', (req, res) => {
  res.send('Hello hero ')
})
app.post("/login",(req,res)=>{
  const user=req.body;
  const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:"60d"
  });
  res.send({accessToken});
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.te6vn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const serviceCollection = client.db("carspot").collection("service");

async function run() {
  try {
    await client.connect();
    app.get('/service',async(req,res)=>{
      const query ={}
    const cursor = serviceCollection.find(query)
    const services = await cursor.toArray();
    res.send(services)
    })

    app.get('/service/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const service = await serviceCollection.findOne(query)
      res.send(service)
    })

    
    app.post("/service", async (req, res) => {
      const newItem = req.body;
      const result = await serviceCollection.insertOne(newItem);
      res.send(result);
    });
    console.log("connected")

  } finally {
   
    
  }
}
app.delete("/myitems/:id", async (req, res) => {
  const id = req.params.id;
  console.log(req.params);
  const query = { _id: ObjectId(id) };
  const result = await serviceCollection.deleteOne(query);
  res.send(result);
});
app.delete("/service/:id", async (req, res) => {
  const id = req.params.id;
  console.log(req.params)
  const query = { _id: ObjectId(id) };
  const result = await serviceCollection.deleteOne(query);
  res.send(result);
});
// JWT
function verifyJwt(req,res,next){
  const authHeader=req.headers.authorization;
  console.log(authHeader);
  if(!authHeader){
    return res.status(401).send({message:"unauthorized access"})
  };
  const token=authHeader.split(" ")[1];
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
    if(err){
      return res.status(403).send({message:"forbidden access"});
    }
    console.log("decoded",decoded);
    req.decoded=decoded;
    next();
  })
  
}
app.put("/restock/:id",async(req,res)=>{
  const id=req.params.id;
  const updatedQuantity=req.body;
  console.log(updatedQuantity)
  const filter={_id:ObjectId(id)}
  const options={upsert:true}
  const updatedDoc={
      $set:{
          quantity:updatedQuantity.newQuantity
      }
  };
  const result=await serviceCollection.updateOne(filter,updatedDoc,options);
  res.send(result);
})

// ___
//Load specific items filtering email
app.get("/items",verifyJwt, async (req, res) => {
  const decodedEmail=req.decoded.email;
  const email=req.query.email;
  console.log(email);
  if(email===decodedEmail){
    console.log(email)
  const query = {email};
  const cursor = serviceCollection.find(query);
  const products = await cursor.toArray();
  res.send(products);
  }
  else{
    res.status(403).send({message:"forbidden access"});
  }
});
run().catch(console.dir);


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})