const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request')
const knockknock = require('./knockknock/')
const wolf = require('./wolf/')

admin.initializeApp(functions.config().firebase)

exports.actions = functions.https.onRequest((request, response) => {
  response.status(200).end()
  let payload = JSON.parse(request.body.payload)
  if (payload.callback_id.includes("knockknock") ) {
    knockKnock(payload)
  }
})

exports.wolframAlpha = functions.https.onRequest(wolf.handler);

exports.eventsHandler = functions.https.onRequest((request, response) => {
  console.log(request.body)
  response.status(200).send(request.body.challenge)
})