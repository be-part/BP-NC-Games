const express = require('express');
const app = express();
const { getCategories} = require('./controllers/categories.controllers');
const { getEndpoints } = require('./controllers/endpoints.controller');

app.get('/api', getEndpoints)

app.get('/api/categories', getCategories)




app.use((err, req, res, next) => {
    res.status(500).send('Server Error!');
  });

module.exports = app;