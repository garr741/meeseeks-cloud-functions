const request = require('request')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const WebClient = require('@slack/client').WebClient
const token = functions.config().slack.key
const verification = functions.config().slack.verification

exports.handler = ((request) => {
  if (request.body.event.sub_type != undefined) {
    return
  }
  console.log("Message Sent")
  let userId = request.body.event.user
  let dataRef = admin.database().ref('data').child('/tracking/messagesSent/' + userId)
  dataRef.transaction((messagesSent) => {
    return (messagesSent || 0) + 1
  })
})