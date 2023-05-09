const { fetchCategories, fetchEndpoints } = require("../models/categories.models")

exports.getEndpoints= (request, response) => {
    fetchEndpoints().then((endpoints) => {
        response.status(200).send({ endpoints: endpoints })
    })
}

exports.getCategories = (request, response) => {
    fetchCategories().then((categories)=>{
        response.status(200).send({ categories: categories }) 
      })
}