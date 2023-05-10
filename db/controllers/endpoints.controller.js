const endpoints = require('../../endpoints.json')

exports.getEndpoints= (request, response) => {
    console.log(endpoints)
    response.status(200).send({ endpoints: endpoints })
}