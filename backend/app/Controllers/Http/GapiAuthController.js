'use strict'
const { google } = require('googleapis'),
  Env = use('Env'),
  Photographer = use('App/Models/Photographer')

const scopes = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar'
]

class GapiAuthController {
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
        `${Env.get('FRONT_URL')}/admin/photographer/authorizationCode`
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

  async refreshToken({ response, request }) {
    const data = request.only(['id']),
      photographer = await Photographer.findOrFail(data.id),
      oldTokens = JSON.stringify(photographer.tokens),
      refresh_token = oldTokens.refresh_token,
      grant_type = 'refresh_token',
      oauth2Client = new google.auth.OAuth2(
        Env.get('GCLIENT_ID'),
        Env.get('GCLIENT_SECRET'),
        refresh_token,
        grant_type
      ),
      { newTokens } = await oauth2Client.getToken(),
      mergeToken = {
        tokens: JSON.stringify(newTokens)
      }
    /*
    photographer.merge(mergeToken)

    await photographer.save()

    return photographer */
  }
}

module.exports = GapiAuthController
