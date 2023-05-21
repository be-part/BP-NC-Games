const connection = require("../connection");
const { checkReviewIdExists } = require("../utils/db.utils");
const categories = require('../data/test-data/categories');
const { Query } = require("pg");


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

exports.fetchReviewsWithCount = (category="TRUE", sort_by="created_at", order= "DESC") => {

    const validSortQueries = ["title", "designer", "owner", "category", "created_at", "votes"]

    const validCategories = ["social deduction", "children's games", "dexterity", "euro game", "TRUE"]
    
    const validOrders = ["DESC", "ASC"]


    let queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, designer, reviews.category, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id `;

    const valuesToAdd = []
    
    if(!validCategories.includes(category)) {
        return Promise.reject({ status: 404, msg: "category not recognised" })
    } else if (category === "TRUE") {
        queryString += `WHERE $1 `
        valuesToAdd.push(category)
    } else {
        queryString += `WHERE category=$1 `
        valuesToAdd.push(category)
    }
   
    queryString += `GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, designer, reviews.category ORDER BY ` 
    
    if (!validSortQueries.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "invalid sort query" });
    } else {
        queryString += `$2`
        valuesToAdd.push(sort_by)
    }

    if(!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "invalid order query" });
    } else if (order === "DESC") {
        queryString += ` DESC;`
    } else if (order === "ASC") {
        queryString += ` ASC;`
    }

        console.log(queryString)
        console.log(valuesToAdd)
        

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