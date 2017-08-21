const WebClient = require('@slack/client').WebClient
const functions = require('firebase-functions')
const token = functions.config().slack.key
const request = require('request')

exports.sendMessageAsUser = ((message, channelId, userId) => {
  let web = new WebClient(token)
  web.users.info(userId, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log("body", res)
      let options = {
        username: res.user.profile.real_name,
        as_user: false,
        icon_url: res.user.profile.image_512
      }
      web.chat.postMessage(channelId, message, options, (err, res) => {
        if (err) {
          console.log("message err", err)
        } else {
          console.log("message success")
        }
      })
    }
  })
})

//the message must be in form { 'text' : message }
exports.sendMessageViaURL = ((message, url) => {
  let postOptions = {
    uri: url,
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