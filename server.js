// @ts-check

const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const mongoUrl = process.env.mongoUrl || "mongodb://127.0.0.1:27017/tests";
mongoose.connect(mongoUrl);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Database connection successfully");
});

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
});


// @ts-ignore
let dbSchema = mongoose.Schema({
    data: Object,
    timestamp: String,
    flag: { type: Boolean, default: true },
});

let DB = mongoose.model("tests", dbSchema);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));

app.post('/record', async (req, res) => {
    console.log(req.body);
    const entry = await new DB({ data: req.body, timestamp: Date.now() });
    await entry.save();
    res.status(201).send();
});

app.get('/results', async (_, res) => {
    const results = await DB.find();
    res.json(results);
})


app.get('/delete/all/for/sure', async (_, res) => {
    const results = await DB.find();

    for (const res of results) {
        await res.remove();
    }

    res.status(201).send(`${results.length} results deleted`);
});


app.post('/flag', async (req, res) => {
    const entry = await DB.findById(req.body.id);
    entry.flag = req.body.flag;
    await entry.save();
    res.status(200).send();
});

app.listen(3001);