'use strict'

const Mail = use('Mail')
const Database = use('Database')
const Client = use('App/Models/Client')
const Region = use('App/Models/Region')
const City = use('App/Models/City')
const Broker = use('App/Models/Broker')
const District = use('App/Models/District')
const Photographer = use('App/Models/Photographer')
const Scheduling = use('App/Models/Scheduling')
const User = use('App/Models/User')

class SchedulingController {
  async index({ request, response, view }) {
    const scheduling = Scheduling.query()
      .with('photographer')
      .with('client')
      .with('services')
      .fetch()

    return scheduling
  }

  async indexClient({ params, request, response, view }) {
    const scheduling = Scheduling.query()
      .where('client_id', params.client_id)
      .with('photographer')
      .with('client')
      .with('services')
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
      .with('photographer')
      .with('client')
      .with('services')
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
      'horary',
      'client_id',
      'file_manager_uuid',
      'retirar_chaves',
      'photo_link',
      'video_link',
      'tour_link'
    ])
    const { services } = request.post()

    const scheduling = await Scheduling.create(data)

    if (services) {
      await scheduling.services().attach(services)
      scheduling.services = await scheduling.services().fetch()
    }

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
      'horary',
      'client_id',
      'actived',
      'changed',
      'completed',
      'downloaded',
      'reason',
      'date_cancel',
      'file_manager_uuid',
      'retirar_chaves',
      'photo_link',
      'video_link',
      'tour_link'
    ])

    const { services } = request.post()

    scheduling.merge(data)

    await scheduling.save()

    if (services) {
      await scheduling.services().detach()
      await scheduling.services().attach(services)
      scheduling.services = await scheduling.services().fetch()
    }

    return scheduling
  }

  async destroy({ params, request, response }) {
    const scheduling = await Scheduling.findOrFail(params.id)

    await scheduling.delete()
  }

  async sendEmailWithoutEvent({ params, request, response, view }) {
    const { scheduling_id } = request.only(['scheduling_id']),
      scheduling = await Scheduling.query()
        .where('id', scheduling_id)
        .with('services')
        .firstOrFail(),
      photographer = await Photographer.findOrFail(scheduling.photographer_id),
      client = await Client.findOrFail(scheduling.client_id),
      user = await User.findOrFail(client.user_id),
      admin = await User.findByOrFail('admin', true),
      services = await scheduling.services().fetch()

    let servicesName = ''

    services.toJSON().map(service => {
      if (servicesName != '') servicesName += ' + '
      servicesName += `${service.name}`
    })

    await Mail.send(
      'emails.addEvent',
      {
        client,
        scheduling,
        photographer,
        admin,
        servicesName
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
      .where('id', params.id)
      .first()
    if (scheduling.completed == false) {
      const photographer = await Photographer.findOrFail(
        scheduling.photographer_id
      )
      const client = await Client.findOrFail(scheduling.client_id)
      const user = await User.findOrFail(client.user_id)
      const broker = await Broker.findOrFail(client.broker_id)
      const admin = await User.findByOrFail('admin', true)

      scheduling.completed = true
      await scheduling.save()

      await Mail.send(
        'emails.completedScheduling',
        {
          client,
          scheduling,
          photographer,
          admin
        },
        message => {
          message
            .to(user.email)
            .bcc(broker.email)
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
    const photographer = await Photographer.findOrFail(
      scheduling.photographer_id
    )
    const client = await Client.findOrFail(scheduling.client_id)
    const user = await User.findOrFail(client.user_id)
    const broker = await Broker.findOrFail(client.broker_id)
    const admin = await User.findByOrFail('admin', true)

    await Mail.send(
      'emails.completedScheduling',
      {
        client,
        scheduling,
        photographer,
        admin
      },
      message => {
        message
          .to(user.email)
          .bcc(broker.email)
          .cc(admin.email)
          .from('noreply@sheephouse.com.br', 'Sheep House')
          .subject('Sheep House - Sessão Concluída')
      }
    )
    return response.status(200).send({ result: 'Agendamento concluido' })
  }
}

module.exports = SchedulingController
