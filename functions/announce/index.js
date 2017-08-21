const request = require('request')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const WebClient = require('@slack/client').WebClient
const helpers = require('./../helpers')

const token = functions.config().slack.key
const verification = functions.config().slack.verification

exports.handler = ((request, response, channelId) => {
  console.log(request.body)
  if (request.body.ping != undefined) {
    response.status(200).send({'result': 'ok'})
    return
  } 
  if (request.body.token != verification) {
    response.status(404).end()
    return
  }
  if (request.body.text.trim() == "") {
    console.log("Empty message")
    response.status(200).send({'text': 'Please add a message'})
    return
  }
  if (request.body.text.trim() == "help") {
    console.log("Asked for help")
    response.status(200).send(getHelpMessage())
    return
  }
  if (request.body.channel_id != channelId) {
    console.log("Posted from the wrong channel")
    response.status(200).send({'text': "Please try again using the #announcements channel. \n\n" + request.body.text})
    return
  }
  console.log("Regular response")
  response.status(200).send({'text': 'Your announcement is on the way. Please use threads to provide more updates or changes!'})
  let message = request.body.text
  let userId = request.body.user_id
  console.log(message, channelId, userId)
  helpers.sendMessageAsUser(message, channelId, userId)
})

const getHelpMessage = () => {
  let message = "Use this command to post to the #announcements channel. \n\n"
  message = message + "To space your text over multiple lines, use Shift+Enter.\n\n"
  message = message + "Tagging, @channel @here and @everyone should work as expected and please use it wisely\n\n"
  message = message + "You cannot edit a message after you send it, so please proofread or make corrections in a thread beneath your message.\n\n"
  message = message + "Please do not double post to #announcements\n"
  let obj = {
    "response_type": "ephemeral",
    "text": message
  }
  return obj
}
