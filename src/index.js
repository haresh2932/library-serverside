const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = require("./routes/api/v1/index");
const connectDB = require('./db/mongodb');


app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

connectDB()

// Use routes

app.use("/api/v1", router)

app.listen(8000, () => {
  console.log(`Server running on http://localhost:${8000}`);
});