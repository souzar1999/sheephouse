'use strict'

const Database = use('Database')
const Horary = use('App/Models/Horary')
const Client = use('App/Models/Client')
const Region = use('App/Models/Region')
const City = use('App/Models/City')
const District = use('App/Models/District')
const Photographer = use('App/Models/Photographer')
const Scheduling = use('App/Models/Scheduling')

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
      .where('active', false)
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
      'actived',
      'region_id',
      'city_id',
      'district_id',
      'photographer_id',
      'horary_id',
      'client_id'
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
      'region_id',
      'city_id',
      'district_id',
      'photographer_id',
      'horary_id',
      'client_id',
      'actived',
      'changed',
      'completed',
      'date_cancel'
    ])

    scheduling.merge(data)

    await scheduling.save()

    return scheduling
  }

  async destroy({ params, request, response }) {
    const scheduling = await Scheduling.findOrFail(params.id)

    await scheduling.delete()
  }
}

module.exports = SchedulingController
