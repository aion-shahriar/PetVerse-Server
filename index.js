const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Middleware to enable CORS
app.use(cors());

// Define the port the server will listen on
const PORT = 3000;



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3tedund.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('petverseDB');
    const listingsCollection = db.collection('listings');
    const ordersCollection = db.collection('orders');

    // GET all listings
    app.get('/listings', async (req, res) => {
      const result = await listingsCollection.find().toArray();
      res.send(result);
    });








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











// Basic route: When a user visits the root URL (/)
app.get('/', (req, res) => {
  res.send('Hello, World! Your Express server is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is purring at http://localhost:${PORT}`);
});