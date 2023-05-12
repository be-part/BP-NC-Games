
const { fetchReviewComments, addComment, removeComment } = require("../models/comments.models");

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

exports.deleteComment = (request, response, next) => {
    const commentId = request.params.comment_id
    removeComment(commentId).then
    (() => {
    response.status(204).send()
    })
    .catch((err) => {
      next(err)
    })
}