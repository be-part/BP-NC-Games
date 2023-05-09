const express = require('express');
const app = express();
const connection = require('../db/connection');
const { getCategories } = require('./controllers/categories.controllers');

app.use(express.json());


app.get('/api/categories', getCategories)




app.use((err, req, res, next) => {
    res.status(500).send('Server Error!');
  });

module.exports = app;