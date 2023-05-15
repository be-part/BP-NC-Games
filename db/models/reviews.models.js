const connection = require("../connection");
const { checkReviewIdExists } = require("../utils/db.utils");
const categories = require('../data/test-data/categories')

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

exports.fetchReviewsWithCount = (category) => {

    

    const validCategories = categories.map((category) => {
        return category.slug
    })
    
    if(category !== undefined && !validCategories.includes(category)) {
        return Promise.reject({ status: 404, msg: "category not recognised" })
    }
    

    let queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, designer, reviews.category, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id `;

    const valuesToAdd = []

    if (category) {
    queryString += `WHERE category=$1 `;
    valuesToAdd.push(category);
    }
   
    queryString += `GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, designer, reviews.category ORDER BY reviews.created_at DESC;`
    
    
    console.log(queryString)     

    return connection.query(queryString, valuesToAdd)
    .then((result) => {

        return result.rows;
    })
}

exports.updateReviewVotes = (votes, reviewId) => {
    

    if (Object.keys(votes).length <1 ) {
           return Promise.reject({ status: 400, msg: "bad request" })
       }
   
       if (!votes.hasOwnProperty('inc_votes')) {
           return Promise.reject({ status: 400, msg: "bad request" })
       }
       
       if(typeof votes.inc_votes !== "number") {
           return Promise.reject({ status: 400, msg: "bad request" })
       }
   
       const queryString = `
        UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *`;
   
       const valuesToAdd = [votes.inc_votes, reviewId]
           
       return checkReviewIdExists(reviewId)
       .then(() => {
           return connection.query(queryString, valuesToAdd);
       })
       .then((result) => {
           return result.rows;
       })
}