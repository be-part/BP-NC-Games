const connection = require("../connection");

exports.fetchReviews = (reviewID) => {
  const reviewID = [reviewID];
  return connection.query(
    `SELECT * FROM reviews
    WHERE review_id = ($1);
    `, reviewID)
    .then((result) => {
        if (result.rows.length === 0) {
        
            return Promise.reject({status: 404, msg: 'that id does not exist!'});
        } return result.rows[0];
     
         });
    };
