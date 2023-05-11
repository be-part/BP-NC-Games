const { fetchReviewComments } = require("../models/comments.models");

exports.getReviewComments = (request, response, next) => {
    fetchReviewComments(request.params.review_id).then((comments)=>{
            response.status(200).send({ comments: comments }) 
          })
          .catch((err) => {
            next(err)
          });
}