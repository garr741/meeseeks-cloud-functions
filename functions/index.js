const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request')

admin.initializeApp(functions.config().firebase)

exports.actions = functions.https.onRequest((request, response) => {
  response.status(200).end()
  let payload = JSON.parse(request.body.payload)
  if (payload.callback_id.includes("knockknock") ) {
    knockKnock(payload)
  }
})

function knockKnock(payload) {
  let responseUrl = payload.response_url
  let answer = payload.actions[0].name
  let reply = "You replied " + answer + ". Thanks!"
  let message = {'text': reply}
  let user = payload.user
  let eventName = payload.callback_id.split('~')[1]
  documentResponse(user, answer, eventName)
  sendMessageToSlackResponseURL(responseUrl, message)
}

function documentResponse(user, answer, eventName) {
  admin.database().ref('/users').orderByChild("name").equalTo(user.name).once('value').then(function(snapshot){
    let userId = user.id
    let real_name = snapshot.val()[userId].profile.real_name;
    admin.database().ref('/events').child(eventName).child(answer).push(real_name)
  })
  console.log(user, answer)
}

function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    let postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            console.log("Error: " + error)
        }
    })
}
