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


let dbSchema = mongoose.Schema({
    data: Object,
    timestamp: String
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

app.listen(3001);