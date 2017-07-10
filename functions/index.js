const functions = require('firebase-functions');
const request = require('request')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.actions = functions.https.onRequest((request, response) => {
  console.log(request.body)
  response.status(200).end()
})

exports.headcount = functions.https.onRequest((request, response) => {
  response.status(200).end()
  var reqBody = request.body
  var responseURL = reqBody.response_url
  var eventName = reqBody.text
  if (reqBody.token == 1){
    response.status(403).end("Access forbidden")
  } else {
    var message = {
      "text": "Hey! The " + eventName + " is coming up soon!",
      "attachments": [
        {
          "text": "Will you be able to attend?",
          "fallback": "Something has gone wrong, ignore this message!",
          "callback_id": "button_response",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
            {
              "name": "Yes",
              "text": "Yes",
              "type": "button",
              "value": "Yes",
              "style": "primary",
            },
            {
              "name": "No",
              "text": "No",
              "type": "button",
              "value": "No",
              "style": "danger"
            },
            {
              "name": "Maybe",
              "text": "Maybe",
              "type": "button",
              "value": "Maybe"
            }
          ]
        }
      ]
    }
    sendMessageToSlackResponseURL(responseURL, message)
  }
})

function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
  var postOptions = {
    uri: responseURL,
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    json: JSONmessage
  }
  request(postOptions, (error, response, body) => {
    if (error){
      console.log(error)
    }
  })
}
