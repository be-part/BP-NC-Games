const { fetchReviews } = require("../models/reviews.models")

exports.getReviews = (request, response) => {
    fetchReviews(request.params.review_id).then((reviews)=>{
        response.status(200).send({ reviews: reviews }) 
      })
}