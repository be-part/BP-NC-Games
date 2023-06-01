const express = require('express');
const cors = require('cors');
const app = express();
const { getCategories} = require('./controllers/categories.controllers');
const { getEndpoints } = require('./controllers/endpoints.controller');
const { getReviews, getReviewsWithCount, updateReview } = require('./controllers/reviews.controllers');
const { getReviewComments, postComment, deleteComment } = require('./controllers/comments.controllers');
const { getUsers } = require('./controllers/users.controllers');

app.use(cors());

app.use(express.json())

app.get('/api', getEndpoints)

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviewsWithCount)

app.get('/api/reviews/:review_id', getReviews)

app.get('/api/reviews/:review_id/comments', getReviewComments)

app.get('/api/users', getUsers)

app.post('/api/reviews/:review_id/comments', postComment)

app.patch('/api/reviews/:review_id', updateReview)

app.delete('/api/comments/:comment_id', deleteComment)


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
  if (err.detail === 'Key (author)=(be-part) is not present in table "users".') {
    res.status(404).send({ msg: 'username not recognised' });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err)
    res.status(500).send('Server Error!');
});

module.exports = app;