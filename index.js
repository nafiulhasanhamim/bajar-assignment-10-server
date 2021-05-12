



const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 9000
require('dotenv').config()
app.use(cors())    //middleware
app.use(bodyParser.json())  //middleware
const MongoClient = require('mongodb').MongoClient;

const ObjectId = require('mongodb').ObjectId

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4du6k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(process.env.DB_USER);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("ajkerbazar").collection("items");
  const orderCollection = client.db("ajkerbazar").collection("order");
  app.post('/addProduct', (req, res) => {    //for data create
    const products = req.body
    console.log(products);
    productsCollection.insertOne(products)
      .then(result => {
        // console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })




  // show data in UI
  app.get('/booking', (req, res) => {
    productsCollection.find()
      .toArray((err, items) => {
        console.log(items)
        res.send(items)
      })

  })



  app.get('/product/:id', (req, res) => {
    productsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })


  app.post('/addCheckOut', (req, res) => {    //for data create
    const product = req.body
    console.log(product);
    orderCollection.insertOne(product)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/orderCollection', (req, res) => {
    console.log(req.query.email);
    orderCollection.find({ email: req.query.email })
      .toArray((err, items) => {
        console.log(items)
        res.send(items)
      })

  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    productsCollection.deleteOne({
      _id: ObjectId(req.params.id)
      // status: "D"
    })
      .then((result) => {
        console.log(result);
        res.send(result.deletedCount > 0)
      })
  })

  app.get('/products', (req, res) => {

    let name = req.query.name
    console.log(req.query)
    if (name) {
      productsCollection.find({ name: { $regex: name, $options: 'i' } })
        .toArray((err, items) => {
          console.log(items)
          res.send(items)
        })
    }
    else {
      productsCollection.find()
        .toArray((err, items) => {
          console.log(items)
          res.send(items)
        })
    }


  })





})





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)
