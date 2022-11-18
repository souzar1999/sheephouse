'use strict'

const Mail = use('Mail')
const Database = use('Database')
const Client = use('App/Models/Client')
const Broker = use('App/Models/Broker')
const Photographer = use('App/Models/Photographer')
const Scheduling = use('App/Models/Scheduling')
const User = use('App/Models/User')
const moment = require('moment')

class SchedulingController {
  async index({ request, response, view }) {
    const {
      photographersId,
      address,
      statusId,
      servicesId,
      clientsId,
      brokersId,
      dateIni,
      dateEnd,
      page,
      rowsPerPage
    } = request.get()

    const query = Scheduling.query()
      .with('photographer')
      .with('client')
      .with('services')
      .orderByRaw('date IS NULL DESC, date DESC, horary desc')

    if (photographersId) {
      if(photographersId.length > 1 && Array.isArray(photographersId)) {
        query.whereIn('photographer_id', photographersId)
      } else {
        query.where('photographer_id', photographersId)
      }
    }

    if (clientsId) {
      if(clientsId.length > 1 && Array.isArray(clientsId)) {
        query.whereIn('client_id', clientsId)
      } else {
        query.where('client_id', clientsId)
      }
    }

    if (brokersId) {
      if(brokersId.length > 1 && Array.isArray(brokersId)) {
        query.whereHas('client', (builder) => {
          builder.whereIn('broker_id', brokersId)
        })
      } else {
        query.whereHas('client', (builder) => {
          builder.where('broker_id', brokersId)
        })
      }
    }

    if (address) {
      query.where('address', 'like', '%' + address + '%')
    }

    if (dateIni) {
      query.where('date', '>=', dateIni)
    }

    if (dateEnd) {
      query.where('date', '<=', dateEnd)
    }

    if (statusId == 0) {
      query.where('actived', '=', 0)
    } else if (statusId == 4) {
      query.where('downloaded', '=', 1)
      query.where('actived', '=', 1)
    } else if (statusId == 3) {
      query.where('completed', '=', 1)
      query.where('actived', '=', 1)
    } else if (statusId == 1) {
      query.where('date', '=', moment().format("YYYY-MM-DD"))
      query.where('actived', '=', 1)
    } else if(statusId == 2) {
      query.where('actived', '=', 1)
      query.where('completed', '=', 0)
      query.where('downloaded', '=', 0)
    } else if(statusId == 5) {
      query.where('date', '=', null)
    }

    if(servicesId) {
      if(servicesId.length > 1 && Array.isArray(servicesId)) {
        query.whereHas('services', (builder) => {
          builder.whereIn('service_id', servicesId)
        })
      } else {
        query.whereHas('services', (builder) => {
          builder.where('service_id', servicesId)
        })
      }

    }

    return query.paginate(parseInt(page) + 1, rowsPerPage)
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
      'email',
      'video_link',
      'tour_link'
    ])
    const { services, prices } = request.post()

    const scheduling = await Scheduling.create(data)

    data.accompanies = data.accompanies + ' - ' + data.comments;
    data.comments = `https://app2.sheephouse.com.br/scheduling/${scheduling.id}/byEmail?z=1`;

    scheduling.merge(data)

    await scheduling.save()

    if (services) {
      services.map(async (service_id, index) => {
        await scheduling.services().attach(service_id)
        await Database.table('scheduling_service')
          .where('service_id', service_id)
          .where('scheduling_id', scheduling.id)
          .update('price', prices[index])
      })

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
      'email',
      'tour_link'
    ])

    const { services, prices } = request.post()

    data.accompanies = data.accompanies + ' - ' + data.comments;
    data.comments = `https://app2.sheephouse.com.br/scheduling/${params.id}/byEmail?z=1`;

    scheduling.merge(data)

    await scheduling.save()

    if (services) {
      await scheduling.services().detach()
      services.map(async (service_id, index) => {
        await scheduling.services().attach(service_id)
        await Database.table('scheduling_service')
          .where('service_id', service_id)
          .where('scheduling_id', params.id)
          .update('price', prices[index])
      })

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
      admin = await User.findByOrFail('admin', true),
      services = await scheduling.services().fetch()

    if(scheduling.client_id) {
      const client = await Client.findOrFail(scheduling.client_id)
    }

    let servicesName = ''

    services.toJSON().map(service => {
      if (servicesName != '') servicesName += ' + '
      servicesName += `${service.name}`
    })

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
      const admin = await User.findByOrFail('admin', true)

      if(scheduling.client_id) {
        const client = await Client.findOrFail(scheduling.client_id),
          user = await User.findOrFail(client.user_id),
          broker = await Broker.findOrFail(client.broker_id)
      }

      scheduling.completed = true
      await scheduling.save()
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
    const admin = await User.findByOrFail('admin', true)

    if(scheduling.client_id) {
      const client = await Client.findOrFail(scheduling.client_id),
        user = await User.findOrFail(client.user_id),
        broker = await Broker.findOrFail(client.broker_id)
    }

    return response.status(200).send({ result: 'Agendamento concluido' })
  }
}

module.exports = SchedulingController
