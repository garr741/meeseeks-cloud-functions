const functions = require('firebase-functions')
const WebClient = require('@slack/client').WebClient;
const token = functions.config().slack.tylor;

exports.handler = ((request, response) => {
  console.log(request.body)
  let ts = request.body.ts
  let channel = request.body.channel
  let web = new WebClient(token)
  web.chat.delete(ts, channel, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(response)
    }
  })
  response.status(200).end()
})