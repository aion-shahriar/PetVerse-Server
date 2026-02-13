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


    // listings routes

    // GET all listings
    app.get('/listings', async (req, res) => {
      const result = await listingsCollection.find().toArray();
      res.send(result);
    });

    // GET single listing
    app.get('/listings/:id', async (req, res) => {
      const { id } = req.params;
      const result = await listingsCollection.findOne({
        _id: new ObjectId(id)
      });
      res.send(result);
    });

    // GET latest 6 listings
    app.get('/latest-listings', async (req, res) => {
      const result = await listingsCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();

      res.send(result);
    });

    // GET listings by category
    app.get('/category/:categoryName', async (req, res) => {
      const { categoryName } = req.params;

      const result = await listingsCollection
        .find({ category: categoryName })
        .toArray();

      res.send(result);
    });

    // GET my listings
    app.get('/my-listings', async (req, res) => {
      const email = req.query.email;

      const result = await listingsCollection
        .find({ email: email })
        .toArray();

      res.send(result);
    });

    // SEARCH by name
    app.get('/search', async (req, res) => {
      const searchText = req.query.text;

      const result = await listingsCollection
        .find({
          name: { $regex: searchText, $options: "i" }
        })
        .toArray();

      res.send(result);
    });

    // ADD listing
    app.post('/listings', async (req, res) => {
      const data = req.body;
      data.createdAt = new Date();
      data.downloads = 0;

      const result = await listingsCollection.insertOne(data);
      res.send(result);
    });

    // UPDATE listing
    app.put('/listings/:id', async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      const result = await listingsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

      res.send(result);
    });

    // DELETE listing
    app.delete('/listings/:id', async (req, res) => {
      const { id } = req.params;

      const result = await listingsCollection.deleteOne({
        _id: new ObjectId(id)
      });

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