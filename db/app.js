const express = require('express');
const app = express();
const { getCategories, getEndpoints } = require('./controllers/categories.controllers');

app.get('/api', getEndpoints)

app.get('/api/categories', getCategories)




app.use((err, req, res, next) => {
    res.status(500).send('Server Error!');
  });

module.exports = app;