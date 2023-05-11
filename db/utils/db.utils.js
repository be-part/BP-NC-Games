const connection = require("../connection");

exports.checkReviewIdExists = (reviewId) => {

    return connection.query(`
    SELECT * FROM reviews WHERE review_id = $1;`, [reviewId]).then((result) => {
    if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'no review found at this id!'})
    }

});
}