const request = require('request')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

const helpers = require('./../helpers')

const verification = functions.config().slack.verification

exports.handler = ((request, response) => {
  console.log(request.body)
  if (request.body.token != verification) {
    response.status(404).end()
  }
  response.status(200).end()
  let responseURL = request.body.response_url
  let attachments = [
    {
      'text': 'Select a door to unlock:', 
      'callback_id': 'speakeasy', 
      'color': '#36a64f', 
      'actions': [
        {
          'name': 'BR - Main - Outer', 
          'text': 'BR - Main - Outer', 
          'type': 'button', 
          'value': 'bmo',
        }, 
        {
          'name': 'BR - Main - Inner', 
          'text': 'BR - Main - Inner', 
          'type': 'button', 
          'value': 'bmi', 
        }, 
        {
          'name': 'BR - Parking Lot Door', 
          'text': 'BR - Parking Lot Door', 
          'type': 'button', 
          'value': 'bp'
        }, 
        {
          'name': 'Downtown - Outer', 
          'text': 'Downtown - Outer', 
          'type': 'button', 
          'value': 'do'
        }, 
        {
          'name': 'Downtown - Inner', 
          'text': 'Downtown - Inner', 
          'type': 'button', 
          'value': 'di'
        },
      ]
    }
  ]  
  let message = { 
    'text': '*THIS COMMAND DOES NOT WORK YET, PLEASE USE THE ORIGINAL /SPEAKEASY COMMAND*',
    'attachments': attachments
  }
  helpers.sendMessageViaURL(message, responseURL)
})

exports.unlocker = ((payload) => {
  console.log(payload)
})