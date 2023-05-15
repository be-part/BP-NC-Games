const { fetchReviews, fetchReviewsWithCount, updateReviewVotes } = require("../models/reviews.models")

exports.getReviews = (request, response, next) => {
    fetchReviews(request.params.review_id).then((reviews)=>{
        response.status(200).send({ review: reviews }) 
      })
      .catch((err) => {
        next(err)
      });
}

exports.getReviewsWithCount = (request, response, next) => {
  const category = request.query.category

  fetchReviewsWithCount(category).then((reviews) => {
    //console.log(response)
        response.status(200).send({ reviews: reviews})
    })
    .catch((err) => {
      next(err)
    });
}

exports.updateReview = (request, response, next) => {
  const reviewId = request.params.review_id
  const votes = request.body
  
  updateReviewVotes(votes, reviewId)
  .then((updatedReview) => {
  response.status(200).send({review: updatedReview})
  })
  .catch((err) => {
    next(err)
  });
}