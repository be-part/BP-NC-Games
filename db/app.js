const express = require('express');
const app = express();
const { getCategories} = require('./controllers/categories.controllers');
const { getEndpoints } = require('./controllers/endpoints.controller');
const { getReviews } = require('./controllers/reviews.controllers');

app.get('/api', getEndpoints)

app.get('/api/categories', getCategories)

app.get('/api/reviews/:review_id', getReviews)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'bad request' });
  } else next(err);
});

app.use((err, req, res, next) => {
    res.status(500).send('Server Error!');
});

module.exports = app;