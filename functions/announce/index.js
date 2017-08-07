const request = require('request')
const functions = require('firebase-functions')
const admin = require('firebase-admin');
const WebClient = require('@slack/client').WebClient;
const token = functions.config().slack.key;

exports.handler = ((request, response) => {
  console.log(request.body)
  if (request.body.text.trim() == "") {
    response.status(200).send({'text': 'Please add a message'})
    return
  }
  admin.database().ref('/config/announceChannel').once('value').then((snapshot) => {
    let channelToPostTo = snapshot.val()
    let web = new WebClient(token)
    let message = ""
    message = message + "Announcement by: <@" + request.body.user_id + "|" + request.body.user_name + ">\n\n\n"
    message = message + request.body.text
    web.chat.postMessage(channelToPostTo, message, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(response)
      }
    })
  })
  response.status(200).send({'text': 'Your announcement is on the way. Please use threads to provide more updates!'})
})