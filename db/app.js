const express = require('express');
const app = express();
const { getCategories} = require('./controllers/categories.controllers');
const { getEndpoints } = require('./controllers/endpoints.controller');
const { getReviews, getReviewsWithCount } = require('./controllers/reviews.controllers');
const { getReviewComments, postComment } = require('./controllers/comments.controllers');

app.use(express.json())

app.get('/api', getEndpoints)

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviewsWithCount)

app.get('/api/reviews/:review_id', getReviews)

app.get('/api/reviews/:review_id/comments', getReviewComments)

app.post('/api/reviews/:review_id/comments', postComment)

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