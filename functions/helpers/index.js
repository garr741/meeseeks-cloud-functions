const WebClient = require('@slack/client').WebClient
const functions = require('firebase-functions')
const token = functions.config().slack.key

exports.sendMessageAsUser = ((message, channelId, userId, userName, iconUrl) => {
  let web = new WebClient(token)
  console.log("check 1")
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
      console.log("check 2")
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