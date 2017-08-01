const request = require('request')
const admin = require('firebase-admin');

exports.handler = (payload) => {
  console.log("tylorg", payload)
  let responseUrl = payload.response_url
  let answer = payload.actions[0].name
  let reply = "You replied " + answer + ". Thanks!"
  let message = {'text': reply}
  let user = payload.user
  let eventName = payload.callback_id.split('~')[1]
  sendMessageToSlackResponseURL(responseUrl, message)
  documentResponse(user, answer, eventName)
}

exports.tester = (payload) => {
  console.log("tgtest", payload)
  let reply = "The test is working!"
  let message = {'text': reply}
  let responseUrl = payload.response_url
  sendMessageToSlackResponseURL(responseUrl, message)
}

documentResponse = ((user, answer, eventName) => {
  admin.database().ref('/users').orderByChild("name").equalTo(user.name).once('value').then(function(snapshot){
    let userId = user.id
    let real_name = snapshot.val()[userId].profile.real_name;
    admin.database().ref('/events').child(eventName).child(answer).push(real_name)
  })
  console.log(user, answer)
})

sendMessageToSlackResponseURL = ((responseURL, JSONmessage) => {
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
    } else {
      console.log("Message reply success")
    }
  })
})
