const request = require('request')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const WebClient = require('@slack/client').WebClient
const token = functions.config().slack.key
const verification = functions.config().slack.verification

exports.handler = ((request, response) => {
  console.log("File Handled", request.body)
  let fileId = request.body.event.file_id
  
  response.status(200).end()
})

uploadFileToFirebase = (user, input) => {
  let ref = admin.storage().bucket().upload(input, (err, file, apiResponse) => {
    console.log("input", input)
    console.log("err", err)
    console.log("file", file)
    console.log("apiResponse", apiResponse)
  })
}