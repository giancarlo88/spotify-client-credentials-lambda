require('dotenv').config()
const request = require('superagent')

module.exports.getToken = (event, context, callback) => {
  const config = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  }

  const makeAuthHeader = (config) => {
    const buffer = new Buffer(`${config.clientId}:${config.clientSecret}`).toString('base64')
    return `Basic ${buffer}`
  }

  const SpotifyAuth = () =>
    new Promise((resolve, reject) => {
      const headers = makeAuthHeader(config)
      const body = { grant_type: 'client_credentials' }
      return (
        request
          .post('https://accounts.spotify.com/api/token')
          .type('form')
          .set('Authorization', headers)
          .send(body)
          .then((res) => {
            return resolve({
              access_token: res.body.access_token
            })
          })
          .catch((err) => {
            return reject(err)
          })
      )
    })

  SpotifyAuth()
    .then((res) => {
      const response = {
        statusCode: 200,
        body: {
          message: 'Got Spotify token.',
          input: res
        }
      }
      return callback(null, response)
    })
    .catch((err) => {
      const response = {
        statusCode: 400,
        body: {
          message: 'Error obtaining token',
          input: err
        }
      }
      return callback(response)
    })
}
