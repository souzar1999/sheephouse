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

class GapiController {
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
      end = { dateTime: dateTimeEnd.substr(0, 19) + '-03:00:00', timeZone },
      start = { dateTime: dateTimeStart.substr(0, 19) + '-03:00:00', timeZone },
      requestBody = {
        end,
        start,
        summary,
        description: 'Testando \n Muito mesmo'
      },
      tokens = JSON.parse(photographer.tokens)

    oauth2Client.setCredentials(tokens)

    const params = { calendarId, auth: oauth2Client , requestBody }

    const res =await calendar.events.insert(params);

    scheduling.google_event_id = res.data.id;

    await scheduling.save();

    return response.status(200).send({ message: "Agendamento criado com sucesso"})
  }

  async insertEventDrone({ request, response }) {
    const {
        oauth2Client,
        calendarId,
        dateTimeEnd,
        dateTimeStart
      } = request.only([
        'oauth2Client',
        'calendarId',
        'dateTimeEnd',
        'dateTimeStart'
      ]),
      summary = `Fotografia Imobiliária - ${emailClient}`,
      timeZone = 'America/Sao_Paulo',
      end = { dateTime: dateTimeEnd, timeZone },
      start = { dateTime: dateTimeStart, timeZone },
      requestBody = {
        end,
        start,
        summary: 'AAAFotografia Imobiliária - Agendamento Teste',
        description: 'Testando \n Muito mesmo'
      },
      params = {
        auth: oauth2Client,
        calendarId,
        requestBody
      },
      res = await calendar.events.insert(params)

    return res
  }
}

module.exports = GapiController
