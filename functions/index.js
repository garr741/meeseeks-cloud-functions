const functions = require('firebase-functions')
const admin = require('firebase-admin')
const request = require('request')
const knockKnock = require('./knockknock/')
const wolf = require('./wolf/')
const announce = require('./announce/')

admin.initializeApp(functions.config().firebase)

exports.actions = functions.https.onRequest((request, response) => {
  response.status(200).end()
  let payload = JSON.parse(request.body.payload)
  if (payload.callback_id.includes("knockknock") ) {
    knockKnock.handler(payload)
  } else if (payload.callback_id.includes("tester")) {
    knockKnock.tester(payload)
  }
})

exports.wolframAlpha = functions.https.onRequest(wolf.handler);

exports.eventsHandler = functions.https.onRequest((request, response) => {
  console.log(request.body)
  response.status(200).send(request.body.challenge)
})

exports.announce = functions.https.onRequest(announce.handler)