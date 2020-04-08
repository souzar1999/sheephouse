'use strict'

const Mail = use('Mail')
const Database = use('Database')
const Horary = use('App/Models/Horary')
const Client = use('App/Models/Client')
const Region = use('App/Models/Region')
const City = use('App/Models/City')
const District = use('App/Models/District')
const Photographer = use('App/Models/Photographer')
const Scheduling = use('App/Models/Scheduling')
const User = use('App/Models/User')

class SchedulingController {
  async index({ request, response, view }) {
    const scheduling = Scheduling.query()
      .with('horary')
      .with('photographer')
      .with('client')
      .fetch()

    return scheduling
  }

  async indexClient({ params, request, response, view }) {
    const scheduling = Scheduling.query()
      .where('client_id', params.client_id)
      .with('horary')
      .with('photographer')
      .with('client')
      .fetch()

    return scheduling
  }

  async indexMonthCompleted({ params, request, response, view }) {
    const scheduling = Scheduling.query()
      .where('date', '>=', params.dateIni)
      .where('date', '<=', params.dateEnd)
      .where('completed', true)
      .fetch()

    return scheduling
  }

  async indexMonthCanceled({ params, request, response, view }) {
    const count = Scheduling.query()
      .where('date', '>=', params.dateIni)
      .where('date', '<=', params.dateEnd)
      .where('actived', false)
      .getCount()

    return count
  }

  async indexDay({ params, request, response, view }) {
    const scheduling = Scheduling.query()
      .where('date', params.date)
      .where('actived', true)
      .fetch()

    return scheduling
  }

  async show({ params, request, response, view }) {
    const scheduling = await Scheduling.query()
      .where('id', params.id)
      .with('horary')
      .with('photographer')
      .with('client')
      .fetch()

    return scheduling
  }

  async store({ request, response }) {
    const data = request.only([
      'date',
      'latitude',
      'longitude',
      'address',
      'complement',
      'accompanies',
      'comments',
      'drone',
      'tour360',
      'actived',
      'region_id',
      'city_id',
      'district_id',
      'photographer_id',
      'horary_id',
      'client_id',
      'file_manager_uuid'
    ])

    const scheduling = await Scheduling.create(data)

    return scheduling
  }

  async update({ params, request, response }) {
    const scheduling = await Scheduling.findOrFail(params.id)
    const data = request.only([
      'date',
      'latitude',
      'longitude',
      'address',
      'complement',
      'comments',
      'accompanies',
      'drone',
      'tour360',
      'region_id',
      'city_id',
      'district_id',
      'photographer_id',
      'horary_id',
      'client_id',
      'actived',
      'changed',
      'completed',
      'downloaded',
      'reason',
      'date_cancel',
      'file_manager_uuid'
    ])

    scheduling.merge(data)

    await scheduling.save()

    return scheduling
  }

  async destroy({ params, request, response }) {
    const scheduling = await Scheduling.findOrFail(params.id)

    await scheduling.delete()
  }

  async sendEmailWithoutEvent({ params, request, response, view }) {
    const { scheduling_id, horary, date } = request.only([
        'scheduling_id',
        'horary'
      ]),
      scheduling = await Scheduling.findOrFail(scheduling_id),
      photographer = await Photographer.findOrFail(scheduling.photographer_id),
      client = await Client.findOrFail(scheduling.client_id),
      user = await User.findOrFail(client.user_id),
      admin = await User.findByOrFail('admin', true)

    await Mail.send(
      'emails.addEvent',
      {
        client,
        scheduling,
        photographer,
        admin
      },
      message => {
        message
          .to(user.email)
          .cc(admin.email)
          .from('noreply@sheephouse.com.br', 'Sheep House')
          .subject('Sheep House - Sessão agendada')
      }
    )

    return response
      .status(200)
      .send({ message: 'Agendamento criado com sucesso' })
  }

  async completeAndSendEmail({ params, request, response, view }) {
    const scheduling = await Scheduling.query()
      .where('file_manager_uuid', params.fileManagerId)
      .first()
    if (scheduling.completed == false) {
      const photographer = await Photographer.findOrFail(
        scheduling.photographer_id
      )
      const client = await Client.findOrFail(scheduling.client_id)
      const user = await User.findOrFail(client.user_id)
      const horary = await Horary.findOrFail(scheduling.horary_id)
      const admin = await User.findByOrFail('admin', true)

      scheduling.completed = true
      await scheduling.save()

      await Mail.send(
        'emails.completedScheduling',
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
            .to(broker.email)
            .cc(admin.email)
            .from('noreply@sheephouse.com.br', 'Sheep House')
            .subject('Sheep House - Sessão Concluída')
        }
      )
    }
    return response.status(200).send({ result: 'Agendamento concluido' })
  }

  async resendEmail({ params, request, response, view }) {
    const scheduling = await Scheduling.query()
      .where('id', params.id)
      .first()
    if (scheduling.completed == true && scheduling.downloaded == false) {
      const photographer = await Photographer.findOrFail(
        scheduling.photographer_id
      )
      const client = await Client.findOrFail(scheduling.client_id)
      const user = await User.findOrFail(client.user_id)
      const horary = await Horary.findOrFail(scheduling.horary_id)
      const admin = await User.findByOrFail('admin', true)

      await Mail.send(
        'emails.completedScheduling',
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
            .from('noreply@sheephouse.com.br', 'Sheep House')
            .subject('Sheep House - Sessão Concluída')
        }
      )
    }
    return response.status(200).send({ result: 'Agendamento concluido' })
  }

  async downloaded({ params, request, response, view }) {
    const scheduling = await Scheduling.query()
      .where('id', params.id)
      .first()
    if (scheduling.downloaded == false) {
      scheduling.downloaded = true
      await scheduling.save()
    }

    return response.status(200).send({ result: 'Imagens baixadas' })
  }
}

module.exports = SchedulingController
