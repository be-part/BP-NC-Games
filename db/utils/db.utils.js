const connection = require("../connection");

exports.checkReviewIdExists = (reviewId) => {
    
    return connection.query(`
    SELECT * FROM reviews WHERE review_id = $1;`, [reviewId]).then((result) => {
    if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'no review found at this id!'})
    }

});
}

exports.checkCommentIdExists = (commentId) => {
    return connection.query(`
        SELECT * FROM comments WHERE comment_id = $1;`, [commentId]).then((result) => {
        if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'no comment found at this id!'})
        }
    
    });
}

exports.getAllCategories = () => {
    return connection.query(`
        SELECT * FROM categories;`).then((result) => {
            let categoryArray =[]
            result.rows.forEach((item) => {
                categoryArray.push(item.slug)
            })
            return categoryArray
        })
}