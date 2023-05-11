
const { fetchReviewComments, addComment } = require("../models/comments.models");

exports.getReviewComments = (request, response, next) => {
    fetchReviewComments(request.params.review_id).then((comments)=>{
            response.status(200).send({ comments: comments }) 
          })
          .catch((err) => {
            next(err)
          });
}

exports.postComment = (request, response, next) => {
    const reviewId = request.params.review_id
    addComment(request.body, reviewId).then
    ((addedComment) => {
    response.status(201).send({comment: addedComment[0]})
    })
    .catch((err) => {
        next(err)
    })
    }