const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(cors({
  origin: ["http://localhost:5173", "https://travelsite-a2d59.web.app", ]
}))
app.use(express.json())


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.75ieoxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// const db = client.db("spotDB");
// the line below creates a collection named 'spot' in the database 
// const spotData = db.collection('spot')  

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const spotCollection = client.db("spotDB").collection('spot');


    app.post("/spot", async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result)
    })

    
    app.post('/countries', async (req, res) => {
      const country = req.body;
      console.log(country)
    })


    app.get('/spot', async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.get('/mySpot/:email', async (req, res) => {
      console.log(req.params.email)
      const result = await spotCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })


    app.get('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.findOne(query);
      res.send(result)
    })



    app.put('/spot/:id', async (req, res) => {
      const id = req.params.id;

      // create a filter for a movie to update
      const filter = { _id: new ObjectId(id) };

      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };

      const updatedSpot = req.body;
      const Spot = {
        $set: {
          craftName : updatedSpot.spotName,
           photo : updatedSpot.photo,
           subCategoryName : updatedSpot.countryName,
           rating : updatedSpot.location,
           description : updatedSpot.description,
           cost : updatedSpot.cost,
           customizable : updatedSpot.season,
           travelDuration : updatedSpot.travelDuration,
           visitors : updatedSpot.visitors,
           userName : updatedSpot.userName,
           email : updatedSpot.email,
        },
      };
      const result = await spotCollection.updateOne( filter, Spot, options)
      res.send(result)

    })


    app.delete('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      result = await spotCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// middleware
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`travel site is running on port ${port}`)
})