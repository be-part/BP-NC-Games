const connection = require('../connection')
const fs = require("fs/promises");

exports.fetchEndpoints = () => {
    return fs.readFile('endpoints.json', 'utf-8').then((result) => {
        const jsObject = JSON.parse(result)
        return jsObject
    })
}

exports.fetchCategories = () => {
    return connection.query(`SELECT * FROM categories`).then((result) => {return result.rows}
    )
}


