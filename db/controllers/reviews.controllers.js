const { fetchReviews, fetchReviewsWithCount } = require("../models/reviews.models")

exports.getReviews = (request, response, next) => {
    fetchReviews(request.params.review_id).then((reviews)=>{
        response.status(200).send({ review: reviews }) 
      })
      .catch((err) => {
        next(err)
      });
}

exports.getReviewsWithCount = (request, response) => {
    fetchReviewsWithCount().then((reviews) => {
        response.status(200).send({ reviews: reviews})
    }).catch((err) => {
      next(err)
    });
}