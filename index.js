import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

  const mongodb = await connectToMongoDB();
  const db=mongodb.db('communityserve');
  const createEventCollection = db.collection('createEvent');

  // API ROUTES

          // CREATE EVENT API
app.post('/create-event',async (req, res) => {
          const eventData = req.body;
          const result =await createEventCollection.insertOne(eventData);
    console.log(result);
    res.send(result);

});

           // CREATE-EVENT API SHOWING DATA 5000
app.get('/create-event',async (req,res)=>{
    const result =await createEventCollection.find().toArray();
    res.send(result);
})

           // Single Event API SHOWING DATA 5000
app.get('/create-event/:id',async (req,res)=>{
    const id = req.params.id;
    const result =await createEventCollection.findOne({_id: new ObjectId(id)});
    res.send(result);
    // console.log(result)
})





    //    BROWSER SIDE 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});