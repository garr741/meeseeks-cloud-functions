const request = require('request')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const WebClient = require('@slack/client').WebClient
const token = functions.config().slack.key
const verification = functions.config().slack.verification
const channelId = functions.config().slack.testinggroundsid

exports.handler = ((request, response) => {
  console.log(request.body)
  if (request.body.token != verification) {
    response.status(404).end()
    return
  }
  if (request.body.channel_id != channelId) {
    response.status(200).send({'text': "Please try again using the #announcements channel." + request.body.text})
    return
  }
  if (request.body.text.trim() == "") {
    response.status(200).send({'text': 'Please add a message'})
    return
  }
  if (request.body.text.trim() == "help") {
    response.status(200).send(getHelpMessage())
    return
  }
  const responseUrl = request.body.response_url
  const text = request.body.text
  sendMessageToSlackResponseURL(responseUrl, text)
  response.status(200).send({'text': 'Your announcement is on the way. Please use threads to provide more updates!'})
})

const getHelpMessage = () => {
  let message = "Use this command to post to the #announcements channel. \n\n"
  message = message + "To space your text over multiple lines, use Shift+Enter.\n\n"
  message = message + "Tagging, @channel @here and @everyone should work as expected and please use it wisely\n\n"
  message = message + "You cannot edit a message after you send it, so please proofread or make corrections in a thread beneath this message.\n"
  message = message + "Please do not double post\n"
  let obj = {
    "response_type": "ephemeral",
    "text": message
  }
  return obj
}

const sendMessageToSlackResponseURL = ((responseURL, message) => {
  let postOptions = {
    uri: responseURL,
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    json: message
  }
  request(postOptions, (error, response, body) => {
    if (error){
      console.log("Error: " + error)
    } else {
      console.log("Message reply success")
    }
  })
})