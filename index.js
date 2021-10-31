const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.begpz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("traveler");
    const tour = database.collection("tour_collection");
    const order = database.collection("order_collection");

    app.get("/service", async (req, res) => {
      const cursor = tour.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // get all order
    app.get("/allorder", async (req, res) => {
      const cursor = order.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // Add Service
    app.post("/addservice", async (req, res) => {
      const data = req.body;
      const result = await tour.insertOne(data);
      res.send(result);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const result = await tour.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.get("/myorder/:email", async (req, res) => {
      const email = req.params?.email;
      if (email) {
        const cursor = order.find({ email: email });
        const result = await cursor.toArray();
        res.send(result);
      } else {
        res.send("error");
      }
    });

    app.post("/placeorder", async (req, res) => {
      const data = req.body;
      const result = await order.insertOne(data);
      res.send(result);
    });
    // delet Order
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const result = await order.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
    app.put("/order/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "approve",
        },
      };
      const result = await order.updateOne(
        { _id: ObjectId(id) },
        updateDoc,
        options
      );
      console.log(result);
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
// app.get("/", (req, res) => {
//   res.send("Ok vai send");
// });
app.listen(port, () => {
  console.log(`listeing on ${port}`);
});
