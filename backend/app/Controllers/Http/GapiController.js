'use strict'
const { google } = require('googleapis')
const Env = use('Env')

const scopes = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar'
]

class GapiController {
  async list({ request, response }) {
    const calendar = google.calendar(Env.get('GAPI_VERSION'))
    const data = request.only(['calendarId', 'date'])

    const timeMax = `${data.date}T23:59:59Z`
    const timeMin = `${data.date}T00:00:00Z`
    const calendarId = data.calendarId
    const auth = Env.get('GAPI_KEY')

    const params = {
      calendarId,
      auth,
      timeMax,
      timeMin
    }

    const res = await calendar.events.list(params)
    return res.data.items
  }

  async authCreate({ request, response }) {
    const oauth2Client = new google.auth.OAuth2(
      Env.get('GCLIENT_ID'),
      Env.get('GCLIENT_SECRET'),
      'http://localhost:3000/admin/photographer/authorizationCode'
    )

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    })

    return url
  }

  async authCode({ request, response }) {
    const data = request.only(['code'])

    const oauth2Client = new google.auth.OAuth2(
      Env.get('GCLIENT_ID'),
      Env.get('GCLIENT_SECRET'),
      'http://localhost:3000/admin/photographer/authorizationCode'
    )

    const { tokens, err } = oauth2Client.getToken(data.code)

    console.log(err)
    console.log(tokens)
    /*
    oauth2Client.setCredentials(tokens)

    oauth2Client.on('tokens', tokens => {
      if (tokens.refresh_token) {
        console.log(tokens.refresh_token)
      }
      console.log(tokens.access_token)
    })*/
  }
}

module.exports = GapiController
