const functions = require('firebase-functions')
const API_KEY = functions.config().google.apikey
const qpx = require('google-flights-api')(API_KEY)

const q = {
   adultCount: 1, 
   maxPrice: 'USD150', 
   solutions: 1, 
   origin: 'KIND',
   destination: 'KLAX', 
   date: '2017-10-10'
};

exports.handler = (request, response) => {
  qpx.query(q).then((data) => {
    console.log(data)
  }).catch(console.error)
}
