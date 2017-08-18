const request = require('request')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const WebClient = require('@slack/client').WebClient
const token = functions.config().slack.key
const verification = functions.config().slack.verification
const channelId = functions.config().slack.generalid


exports.handler = ((request) => {
  let newChannelName = request.body.event.channel.name 
  let newChannelId = request.body.event.channel.id
  let message = "A new channel: <#" + newChannelId + "|" + newChannelName +"> was just created!"
  let web = new WebClient(token)
  web.chat.postMessage(channelId, message, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res)
    }
  })
})