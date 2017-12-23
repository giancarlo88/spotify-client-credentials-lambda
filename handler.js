'use strict'
const fetch = require('node-fetch')

module.exports.getToken = (event, context, callback) => {

  const config = {
    "clientId" : process.env.CLIENT_ID,
    "clientSecret" : process.env.CLIENT_SECRET
  }

  const makeAuthHeader = (config) => {
    const b64 = new Buffer(`${config.clientId}:${config.clientSecret}`).toString('base64')
    return {
      Authorization: `Basic ${b64}`,
      'Access-Control-Allow-Origin': '*'
    }
  }

  const SpotifyAuth = () => new Promise((resolve, reject) => {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'post',
      headers: makeAuthHeader(config),
      credentials: 'include',
      body: {
        grant_type: 'client_credentials'
      }
    }).then((res) => {
      console.log(res)
      return {
        access_token: res.text()
      }
    })
  })

  SpotifyAuth().then(res => {

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Got Spotify token.',
        input: res.text()
      })
    }
    callback(null, response)
  })


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}
