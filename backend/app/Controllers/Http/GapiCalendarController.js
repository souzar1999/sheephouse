'use strict'
const { google } = require('googleapis'),
  Mail = use('Mail'),
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

  async insertEvent({ request, response }) {
    const { scheduling_id, horary, date } = request.only([
        'scheduling_id',
        'horary',
        'date'
      ]),
      numTime = Date.parse(`1970-01-01T${horary}Z`),
      numDate = Date.parse(`${date}T00:00:00Z`),
      dateTimeStart = new Date(numDate + numTime).toISOString(),
      dateTimeEnd = new Date(numDate + numTime + 4500000).toISOString(),
      oauth2Client = new google.auth.OAuth2(
        Env.get('GCLIENT_ID'),
        Env.get('GCLIENT_SECRET')
      ),
      scheduling = await Scheduling.findOrFail(scheduling_id),
      photographer = await Photographer.findOrFail(scheduling.photographer_id),
      client = await Client.findOrFail(scheduling.client_id),
      broker = await Broker.findOrFail(client.broker_id),
      user = await User.findOrFail(client.user_id),
      horaryItem = await Horary.findOrFail(scheduling.horary_id),
      admin = await User.findByOrFail('admin', true),
      calendarId = photographer.email,
      title = scheduling.drone ? 'Filmagem Aérea' : 'Fotografia Imobiliária',
      summary = `${title} - (${user.email} | ${broker.name})`,
      description = `--- Serviço ---\n${title}\n\n--- Funcionário ---\n${photographer.name}\n\n--- Informações sobre o cliente ---\nEmail: ${user.email}\nNome / Empresa: ${client.name} / ${broker.name}\nEndereço do Imóvel / Observação: ${scheduling.address} (${scheduling.complement})\n\nAcesse a plataforma <a href="https://app.sheephouse.com.br/scheduling/${scheduling_id}">aqui</a> para cancelar ou reagendar`,
      timeZone = 'America/Sao_Paulo',
      end = { dateTime: dateTimeEnd.substr(0, 22) + '-03:00:00', timeZone },
      start = { dateTime: dateTimeStart.substr(0, 22) + '-03:00:00', timeZone },
      requestBody = {
        end,
        start,
        summary,
        description
      },
      tokens = JSON.parse(photographer.tokens)

    oauth2Client.setCredentials(tokens)

    const params = { calendarId, auth: oauth2Client, requestBody }

    await calendar.events.insert(params).then(async res => {
      scheduling.google_event_id = res.data.id

      await scheduling.save()

      await Mail.send(
        'emails.addEvent',
        {
          client,
          scheduling,
          photographer,
          horaryItem,
          admin
        },
        message => {
          message
            .to(user.email)
            .cc(admin.email)
            .from('noreply@sheephouse.com.br', 'Sheephouse')
            .subject('Sheephouse - Sessão agendada')
        }
      )

      return response
        .status(200)
        .send({ message: 'Agendamento criado com sucesso' })
    })
  }

  async editEvent({ request, response }) {
    const { scheduling_id, horary, date } = request.only([
        'scheduling_id',
        'horary',
        'date'
      ]),
      numTime = Date.parse(`1970-01-01T${horary}Z`),
      numDate = Date.parse(`${date}T00:00:00Z`),
      dateTimeStart = new Date(numDate + numTime).toISOString(),
      dateTimeEnd = new Date(numDate + numTime + 4500000).toISOString(),
      oauth2Client = new google.auth.OAuth2(
        Env.get('GCLIENT_ID'),
        Env.get('GCLIENT_SECRET')
      ),
      scheduling = await Scheduling.findOrFail(scheduling_id),
      photographer = await Photographer.findOrFail(scheduling.photographer_id),
      client = await Client.findOrFail(scheduling.client_id),
      broker = await Broker.findOrFail(client.broker_id),
      user = await User.findOrFail(client.user_id),
      horaryItem = await Horary.findOrFail(scheduling.horary_id),
      admin = await User.findByOrFail('admin', true),
      calendarId = photographer.email,
      eventId = scheduling.google_event_id,
      title = scheduling.drone ? 'Filmagem Aérea' : 'Fotografia Imobiliária',
      summary = `${title} - (${user.email} | ${broker.name})`,
      description = `--- Serviço ---\n${title}\n\n--- Funcionário ---\n${photographer.name}\n\n--- Informações sobre o cliente ---\nEmail: ${user.email}\nNome / Empresa: ${client.name} / ${broker.name}\nEndereço do Imóvel / Observação: ${scheduling.address} (${scheduling.complement})\n\nAcesse a plataforma <a href="https://app.sheephouse.com.br/scheduling/${scheduling_id}">aqui</a> para cancelar ou reagendar`,
      timeZone = 'America/Sao_Paulo',
      end = { dateTime: dateTimeEnd.substr(0, 22) + '-03:00:00', timeZone },
      start = { dateTime: dateTimeStart.substr(0, 22) + '-03:00:00', timeZone },
      requestBody = {
        end,
        start,
        summary,
        description
      },
      tokens = JSON.parse(photographer.tokens)

    oauth2Client.setCredentials(tokens)

    const params = { calendarId, eventId, auth: oauth2Client, requestBody }

    await calendar.events.update(params).then(async res => {
      await Mail.send(
        'emails.reschedulingEvent',
        {
          client,
          scheduling,
          photographer,
          horaryItem,
          admin
        },
        message => {
          message
            .to(user.email)
            .cc(admin.email)
            .from('noreply@sheephouse.com.br', 'Sheephouse')
            .subject('Sheephouse - Sessão reagendada')
        }
      )

      return response
        .status(200)
        .send({ message: 'Agendamento alterado com sucesso' })
    })
  }

  async cancelEvent({ request, response }) {
    const { scheduling_id } = request.only(['scheduling_id']),
      oauth2Client = new google.auth.OAuth2(
        Env.get('GCLIENT_ID'),
        Env.get('GCLIENT_SECRET')
      ),
      scheduling = await Scheduling.findOrFail(scheduling_id),
      photographer = await Photographer.findOrFail(scheduling.photographer_id),
      client = await Client.findOrFail(scheduling.client_id),
      broker = await Broker.findOrFail(client.broker_id),
      user = await User.findOrFail(client.user_id),
      horary = await Horary.findOrFail(scheduling.horary_id),
      admin = await User.findByOrFail('admin', true),
      calendarId = photographer.email,
      eventId = scheduling.google_event_id,
      tokens = JSON.parse(photographer.tokens)

    oauth2Client.setCredentials(tokens)

    const params = { calendarId, auth: oauth2Client, eventId }

    await calendar.events.delete(params).then(async res => {
      await Mail.send(
        'emails.cancelEvent',
        {
          client,
          scheduling,
          photographer,
          horary,
          admin
        },
        message => {
          message
            .to(user.email)
            .cc(admin.email)
            .from('noreply@sheephouse.com.br', 'Sheephouse')
            .subject('Sheephouse - Sessão cancelada')
        }
      )

      return response
        .status(200)
        .send({ message: 'Agendamento alterado com sucesso' })
    })
  }
}

module.exports = GapiCalendarController
