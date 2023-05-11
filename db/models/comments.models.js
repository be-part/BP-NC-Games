
const connection = require("../connection");
const { checkReviewIdExists } = require("../utils/db.utils");
    
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
        
}