const request = require('request')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const WebClient = require('@slack/client').WebClient
const token = functions.config().slack.key
const verification = functions.config().slack.verification

exports.handler = ((request) => {
  let userId = request.body.event.user_id
  let dataRef = admin.database().ref('data').child('/tracking/fileUploads/' + userId)
  dataRef.transaction((fileUploads) => {
    return (fileUploads || 0) + 1
  })
})