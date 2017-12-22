const functions = require('firebase-functions')
const admin = require('firebase-admin')
const request = require('request')
const knockKnock = require('./knockknock/')
const wolf = require('./wolf/')
const announce = require('./announce/')
const deleteMessage = require('./deleteMessage/')
const channels = require('./channels')
const messages = require('./messages')
const files = require('./files')
const calendar = require('./calendar')
const speakeasy = require('./speakeasy')
const flights = require('./flights')

admin.initializeApp(functions.config().firebase)

exports.actions = functions.https.onRequest((request, response) => {
  response.status(200).end()
  let payload = JSON.parse(request.body.payload)
  if (payload.callback_id.includes("knockknock") ) {
    knockKnock.handler(payload)
  } else if (payload.callback_id.includes("tester")) {
    knockKnock.tester(payload)
  } else if (payload.callback_id.includes("speakeasy")) {
    speakeasy.unlocker(payload)
  }
})

exports.wolframAlpha = functions.https.onRequest(wolf.handler);

exports.eventsHandler = functions.https.onRequest((request, response) => {
  console.log(request)
  response.status(200).end()
  switch (request.body.event.type) {
    case 'channel_created':
      channels.handler(request)
      return
    case 'message':
      messages.handler(request)
      return
    case 'file_created':
      files.handler(request)
      return
  }
})

exports.announce = functions.https.onRequest((request, response) => {
  admin.database().ref('/config').once('value').then(function(snapshot){
    const channelId = snapshot.val()['announceChannel']
    announce.handler(request, response, channelId)
  })
})

exports.deleteMessage = functions.https.onRequest(deleteMessage.handler)

exports.calendar = functions.https.onRequest((request, response) => {
  admin.database().ref('/config').once('value').then(function(snapshot){
    const responseURL = snapshot.val()['calendarWebhook']
    calendar.handler(request, response, responseURL)
  })
})

exports.speakeasy = functions.https.onRequest(speakeasy.handler)

exports.flights = functions.https.onRequest(flights.handler)