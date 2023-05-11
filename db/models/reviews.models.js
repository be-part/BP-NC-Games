const connection = require("../connection");

exports.fetchReviews = (reviewID) => {
    const valuesToAdd = [reviewID];
    return connection.query(
      `SELECT * FROM reviews
      WHERE review_id = $1;
      `, valuesToAdd)
      .then((result) => {
          if (result.rows.length === 0) {
          
              return Promise.reject({status: 404, msg: 'no review found at this id!'});
          } return result.rows[0];
       
           });
      };

exports.fetchReviewsWithCount = () => {
    return connection.query(
        `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.comment_id) AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, designer
        ORDER BY reviews.created_at DESC;`
    ).then((result) => {
        return result.rows
    })
}