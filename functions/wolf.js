const functions = require('firebase-functions');
const wolfram = require('wolfram').createClient(functions.config().wolf.key)

exports.handler = ((request, response) => {
  let query = request.body.query
  wolfram.query(query, function(err, result){
    if (err) {
      console.log(err)
      response.send(400)
      return
    }
    response.status(200).send(result[1]["subpods"][0]["value"])
  })
})