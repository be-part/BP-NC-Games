const { fetchCategories } = require("../models/categories.models")

exports.getCategories = (request, response) => {
    fetchCategories().then((categories)=>{
        response.status(200).send({ categories: categories }) 
      })
}