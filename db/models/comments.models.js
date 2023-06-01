
const connection = require("../connection");
const { checkReviewIdExists, checkCommentIdExists } = require("../utils/db.utils");
//const usernames = require('../data/test-data/users')

exports.fetchReviewComments = (reviewId) => {
     
    const queryString =
    `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.review_id FROM comments
    LEFT JOIN reviews
    ON comments.review_id = reviews.review_id
    WHERE comments.review_id = $1
    ORDER BY comments.created_at DESC`;
    
    const valuesToAdd = [reviewId];            
    
    return checkReviewIdExists(reviewId)
    .then(() => {
        return connection.query(queryString, valuesToAdd);
    })
    .then((result) => {
        return result.rows;
    })
};


exports.addComment = (newComment, reviewId) => {
    
    if (!newComment.hasOwnProperty('username') || !newComment.hasOwnProperty('body')) {
        return Promise.reject({ status: 400, msg: "bad request" })
    }

    // const validUsernames = usernames.map((user) => {
    //     return user.username
    // })
    
    // if(!validUsernames.includes(newComment.username)) {
    //     return Promise.reject({ status: 404, msg: "username not recognised" })
    // }

    const queryString = `
    INSERT INTO comments
    (body, review_id, author)
    VALUES
    ($1, $2, $3)
    RETURNING *`;

    const valuesToAdd = [newComment.body, reviewId, newComment.username]
        
    return checkReviewIdExists(reviewId)
    .then(() => {
        return connection.query(queryString, valuesToAdd);
    })
    .then((result) => {
        return result.rows;
        
    })
};

exports.removeComment = (commentId) => {

    const queryString = `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`
    
    const valuesToAdd = [commentId]
    
    return checkCommentIdExists(commentId)
        .then(() => {
            return connection.query(queryString, valuesToAdd);
        })
        .then((result) => {
            return result.rows;
        })
}