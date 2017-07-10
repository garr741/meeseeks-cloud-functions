const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.status(200).end()
});

exports.actions = functions.https.onRequest((request, response) => {
  response.status(200).end()
})

exports.headcount = functions.https.onRequest((request, response) => {
  console.log(request.body)
  var reqBody = req.body
  var responseURL = reqBody.response_url
  if (reqBody.token != YOUR_APP_VERIFICATION_TOKEN){
    res.status(403).end("Access forbidden")
  } else {
    var message = {
      "text": "This is your first interactive message",
      "attachments": [
        {
          "text": "Building buttons is easy right?",
          "fallback": "Shame... buttons aren't supported in this land",
          "callback_id": "button_tutorial",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
            {
              "name": "yes",
              "text": "yes",
              "type": "button",
              "value": "yes"
            },
            {
              "name": "no",
              "text": "no",
              "type": "button",
              "value": "no"
            },
            {
              "name": "maybe",
              "text": "maybe",
              "type": "button",
              "value": "maybe",
              "style": "danger"
            }
          ]
        }
      ]
    }
    sendMessageToSlackResponseURL(responseURL, message)
  }
  response.status(200).end()
})
