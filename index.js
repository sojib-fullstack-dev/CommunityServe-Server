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
const db = mongodb.db('communityserve');
const createEventCollection = db.collection('createEvent');
const joinEventCollection = db.collection('joinEvent');

// API ROUTES

// CREATE EVENT API
app.post('/create-event', async (req, res) => {
  const eventData = req.body;
  const result = await createEventCollection.insertOne(eventData);
  // console.log(result);
  res.send(result);

});

// CREATE-EVENT API SHOWING DATA 5000
app.get('/create-event', async (req, res) => {
  const result = await createEventCollection.find().toArray();
  res.send(result);
})

// Single Event API SHOWING DATA 5000
app.get('/create-event/:id', async (req, res) => {
  const id = req.params.id;
  const result = await createEventCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
  // console.log(result)
})

// join event edit API

app.patch('/create-event/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await createEventCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// join event delete API
 
app.delete('/create-event/:id', async (req, res) =>{
        try {
    const { id } = req.params;
    const result = await createEventCollection.deleteOne(
      { _id: new ObjectId(id) }   );
 
    res.status(200).json(result);
    
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
})


// join event API

app.post('/join-event', async (req, res) => {

  try {
    const joinEventData = req.body;
    if (!joinEventData.userId) {
      return res.status(400).json({ message: "User ID is required. Please login." });
    }
    const alreadyjoined = await joinEventCollection.findOne({
      userId: joinEventData.userId,
      eventId: joinEventData.eventId
    });
    if (alreadyjoined) {
      return res.status(400).json({ message: "You have already joined this event!" });
    }

    const result = await joinEventCollection.insertOne(joinEventData);
    console.log(result);
    res.send(result);

  } catch (error) {
    console.error("Join event error:", error);

    res.status(500).json({ message: "Internal server error", error: error.message });
  }

})

// join event singel email API

app.get('/join-event/:email', async (req, res) => {
  try {
    const { email } = req.params
    const result = await joinEventCollection.find({ userEmail: email }).toArray()
    res.send(result)
    // console.log(result)
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server Error" });
  }
})


// join event cancel API

app.delete('/join-event/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await joinEventCollection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).send(result);
    // console.log('delete', result)
  } catch (error) {
    res.status(500).send({ error: "Failed to delete" });
  }
})


// manage event api 
 
app.get('/manage-event/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await createEventCollection.find({ email: email }).toArray();
        res.send(result);
        console.log(result);
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server Error" });
    }
})


//    BROWSER SIDE 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});