import express from 'express';
import mongo from "mongodb"
import cors from 'cors';
import connect from './db.js';

const app = express(); // instanciranje aplikacije
const port = 3000; // port na kojem će web server slušati

app.use(cors());
app.use(express.json()); // automatski dekodiraj JSON poruke



app.get('/task', async (req, res) => {
    let db = await connect();
    let query = req.query;

    let selekcija = {};

    
    console.log('Selekcija', selekcija);

    let cursor = await db.collection('task').find(selekcija);
    let results = await cursor.toArray();

    res.json(results);
});

app.post('/task', async (req, res) => {
    let db = await connect();
    let doc = req.body;
    let result = await db.collection('task').insertOne(doc);
    if (result.insertedCount == 1) {
    res.json({
    status: 'success',
    id: result.insertedId,
    });
    } else {
    res.json({
    status: 'fail',
    });
    }
   });

//505 zadatak
   app.put('/task/:id', async (req, res) => {  //mjenja cijeli dokument
    let doc = req.body;
    // ako postoji, brišemo _id u promjenama (želimo da ostane originalni _id)
    delete doc._id;
    let id = req.params.id;
    let db = await connect();
    let result = await db.collection('task').replaceOne({ _id:
   mongo.ObjectId(id) }, doc);
    if (result.modifiedCount == 1) {
    res.json({
    status: 'success',
    id: result.insertedId,
    });


} else {
    res.json({
    status: 'fail',
    });
    }
   });


   app.patch('/task/:id', async (req, res) => {   // mjenja samo neke atribute
    let doc = req.body;
    delete doc._id;
    let id = req.params.id;
    let db = await connect();
    let result = await db.collection('task').updateOne(
    { _id: mongo.ObjectId(id) },
    {
    $set: doc,
    }
    );
    if (result.modifiedCount == 1) {
    res.json({
    status: 'success',
    id: result.insertedId,
    });
    } else {
        res.json({
            status: 'fail',
            });
            }
           });


app.listen(port, () => console.log(`Slušam na portu ${port}!`));
