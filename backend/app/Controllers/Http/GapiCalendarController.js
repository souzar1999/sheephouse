'use strict'
const { google } = require('googleapis'),
  Env = use('Env'),
  calendar = google.calendar(Env.get('GAPI_VERSION')),
  Photographer = use('App/Models/Photographer'),
  Client = use('App/Models/Client'),
  Horary = use('App/Models/Horary'),
  Scheduling = use('App/Models/Scheduling'),
  Broker = use('App/Models/Broker'),
  User = use('App/Models/User')

class GapiCalendarController {
  async eventList({ request, response }) {
    const { photographer_id, date } = request.only(['photographer_id', 'date']),
      photographer = await Photographer.findOrFail(photographer_id),
      timeMax = `${date}T23:59:59Z`,
      timeMin = `${date}T00:00:00Z`,
      calendarId = photographer.email,
      params = {
        calendarId,
        auth: Env.get('GAPI_KEY'),
        timeMax,
        timeMin
      },
      res = await calendar.events.list(params)

    return res.data.items
  }

  async insertEventPhoto({ request, response }) {
    const { scheduling_id, dateTimeEnd, dateTimeStart } = request.only([
        'scheduling_id',
        'dateTimeEnd',
        'dateTimeStart'
      ]),
      oauth2Client = new google.auth.OAuth2(
        Env.get('GCLIEND_ID'),
        Env.get('GCLIEND_SECRET')
      ),
      scheduling = await Scheduling.findOrFail(scheduling_id),
      photographer = await Photographer.findOrFail(scheduling.photographer_id),
      horary = await Horary.findOrFail(scheduling.horary_id),
      client = await Client.findOrFail(scheduling.client_id),
      broker = await Broker.findOrFail(client.broker_id),
      user = await User.findOrFail(client.user_id),
      calendarId = photographer.email,
      summary = `Fotografia Imobiliária - (${user.email} | ${broker.name})`,
      timeZone = 'America/Sao_Paulo',
      end = { dateTime: dateTimeEnd.substr(0, 22) + '-03:00:00', timeZone },
      start = { dateTime: dateTimeStart.substr(0, 22) + '-03:00:00', timeZone },
      requestBody = {
        end,
        start,
        summary,
        description: 'Testando \n Muito mesmo'
      },
      tokens = JSON.parse(photographer.tokens)

    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token
    })

    oauth2Client.on('tokens', tokens => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        console.log(tokens.refresh_token)
      }
      console.log(tokens.access_token)
    })

    const params = { calendarId, auth: oauth2Client, requestBody }

    console.log(' - - - - -  - -')
    await calendar.events
      .insert(params)
      .then(async res => {
        console.log(res.data)

        scheduling.google_event_id = res.data.id

        await scheduling.save()

        return response
          .status(200)
          .send({ message: 'Agendamento criado com sucesso' })
      })
      .catch(err => {
        console.log(err)
      })
  }

  async editEvent({ request, response }) {
    const { scheduling_id, dateTimeEnd, dateTimeStart } = request.only([
        'scheduling_id',
        'dateTimeEnd',
        'dateTimeStart'
      ]),
      oauth2Client = new google.auth.OAuth2(
        Env.get('GCLIEND_ID'),
        Env.get('GCLIEND_SECRET')
      ),
      scheduling = await Scheduling.findOrFail(scheduling_id),
      photographer = await Photographer.findOrFail(scheduling.photographer_id),
      calendarId = photographer.email,
      timeZone = 'America/Sao_Paulo',
      end = { dateTime: dateTimeEnd.substr(0, 22) + '-03:00:00', timeZone },
      start = { dateTime: dateTimeStart.substr(0, 22) + '-03:00:00', timeZone },
      requestBody = {
        end,
        start
      },
      tokens = JSON.parse(photographer.tokens)

    oauth2Client.setCredentials(tokens)

    const params = { calendarId, auth: oauth2Client, requestBody }

    const res = await calendar.events.insert(params)

    scheduling.changed = res.data.id

    await scheduling.save()

    return response
      .status(200)
      .send({ message: 'Agendamento alterado com sucesso' })
  }

  async cancelEvent({ request, response }) {
    const { scheduling_id } = request.only(['scheduling_id']),
      oauth2Client = new google.auth.OAuth2(
        Env.get('GCLIEND_ID'),
        Env.get('GCLIEND_SECRET')
      ),
      scheduling = await Scheduling.findOrFail(scheduling_id),
      photographer = await Photographer.findOrFail(scheduling.photographer_id),
      calendarId = photographer.email,
      eventId = scheduling.google_event_id,
      tokens = JSON.parse(photographer.tokens)

    oauth2Client.setCredentials(tokens)

    const params = { calendarId, auth: oauth2Client, eventId }

    const res = await calendar.events.delete(params)

    scheduling.actived = false

    await scheduling.save()

    return response
      .status(200)
      .send({ message: 'Agendamento cancelado com sucesso' })
  }
}

module.exports = GapiCalendarController
