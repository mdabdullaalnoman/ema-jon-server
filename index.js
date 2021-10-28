const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const objectid = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


// Middle were 
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ne473.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        // create a database on mongodb
        const database = client.db("ema_jon_simple");
        const allProducts = database.collection('allProducts');


        // Get Api (load all products)----------------------
        app.get('/allProducts', async (req, res) => {
            const cursor = allProducts.find({});
            const page = req.query.page;
            const size = parseInt((req.query.size));
            let allProduct;
            const count = await cursor.count();
            console.log(req.query);
            if (page) {
                allProduct = await cursor.skip(page * size).limit(size).toArray()
            }
            else {
                 allProduct = await cursor.toArray();
            }

            // .limit(10) (show only first 10 products)
            // const allProduct = await cursor.toArray();
            console.log(typeof page , size);
            res.send({
                count,
                allProduct
            });
        })

    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('hellow word');
})

app.listen(port, () => {
    console.log('listtening port ', port);
});