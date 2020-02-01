'use strict'
const { google } = require('googleapis'),
  Env = use('Env'),
  Photographer = use('App/Models/Photographer')

const scopes = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar'
]

class GapiController {
  async authUrl({ request, response }) {
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

  async authFirst({ response, request }) {
    const data = request.only(['code', 'id']),
      oauth2Client = new google.auth.OAuth2(
        Env.get('GCLIENT_ID'),
        Env.get('GCLIENT_SECRET'),
        'http://localhost:3000/admin/photographer/authorizationCode'
      ),
      { tokens } = await oauth2Client.getToken({ code: data.code }),
      photographer = await Photographer.findOrFail(data.id),
      mergeToken = {
        tokens: JSON.stringify(tokens)
      }

    photographer.merge(mergeToken)

    await photographer.save()

    return photographer
  }
}

module.exports = GapiController
