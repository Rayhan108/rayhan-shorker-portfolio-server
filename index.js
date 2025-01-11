const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient,ServerApiVersion,ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Rayhan Shorker portfolio Server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njyz70v.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.njyz70v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const projectCollection = client.db("portfolioDB").collection("projects");
 


    // get single project using params
    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await projectCollection.findOne(query);

      res.send(result);
    });

// get all projects
    app.get("/allProjects", async (req, res) => {
      const result = await projectCollection.find().toArray();
      res.send(result);
    });


app.post("/addProject",async(req,res)=>{
  
  const project = req.body;
  console.log(project);
  const result = await projectCollection.insertOne(project);
  res.send(result);
})



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

app.listen(port, () => {
  console.log(`Rayhan Shorker portfolio is running on port ${port}`);
});
