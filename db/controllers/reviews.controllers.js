const { fetchReviews } = require("../models/reviews.models")

exports.getReviews = (request, response, next) => {
    fetchReviews(request.params.review_id).then((reviews)=>{
        response.status(200).send({ review: reviews }) 
      })
      .catch((err) => {
        next(err)
      });
}