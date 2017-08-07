const request = require('request')
const admin = require('firebase-admin');

exports.handler = ((request, response) => {
  response.status(200).end()
})