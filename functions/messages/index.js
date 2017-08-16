const request = require('request')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const WebClient = require('@slack/client').WebClient
const token = functions.config().slack.key
const verification = functions.config().slack.verification

exports.handler = ((request, response) => {
  console.log("Message Handled", request.body)
  response.status(200).end()
})