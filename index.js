const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://techshope:dwIf1lmncChWtH49@cluster0.q76gwva.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const products = client.db("product").collection("productData");

    app.post("/product", async (req, res) => {
      const product = req.body;
      const AllData = await products.insertOne(product);
      res.send(AllData);
    });

    app.get('/product' , async(req , res)=>{
      const cursor = products.find();
      const result = await cursor.toArray()
      res.send(result)

    })

    app.get('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const product = await products.findOne(query);
      res.send(product) 
    })
    // app.get('/product/:brand', async(req, res) =>{
    //   const brand = req.params.brand;
    //   const query = { brand : brand};
    //   const product = await products.findOne(query);
    //   res.send(product) 
    // })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
