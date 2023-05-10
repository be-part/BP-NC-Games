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