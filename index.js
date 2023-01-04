const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.j5z5yuh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const cameraCollection = client.db("Lensa").collection("cameraForSale");
    const addedProductsCollection = client
      .db("addedProducts")
      .collection("Cart");

    app.get("/products", async (req, res) => {
      const query = {};
      const result = await cameraCollection.find(query).toArray();
      res.send(result);
    });

    //get single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cameraCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await addedProductsCollection.insertOne(product);
      res.send(result);
    });

    //get added products
    app.get("/AddedProducts", async (req, res) => {
      const query = {};
      const result = await addedProductsCollection.find(query).toArray();
      res.send(result);
    });

    //get added single product
    app.get("/AddedProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await addedProductsCollection.find(query).toArray();
      res.send(result);
    });

    //delete added single product
    app.delete("/AddedProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await addedProductsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((error) => {
  console.log(error);
});

app.get("/", (req, res) => {
  res.send("Hello author!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
