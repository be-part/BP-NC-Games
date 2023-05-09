const connection = require('../connection')

exports.fetchCategories = () => {
    return connection.query(`SELECT * FROM categories`).then((result) => {return result.rows}
    )
}