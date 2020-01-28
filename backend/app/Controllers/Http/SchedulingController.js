'use strict'

const Database = use('Database')
const Horary = use('App/Models/Horary')
const Client = use('App/Models/Client')
const Region = use('App/Models/Region')
const Photographer = use('App/Models/Photographer')
const Scheduling = use('App/Models/Scheduling')

class SchedulingController {
  async index({ request, response, view }) {
    const properties = Scheduling.query()
      .with('horary')
      .with('photographer')
      .with('client')
      .fetch()

    return properties
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
      'drone',
      'region_id',
      'horary_id',
      'client_id'
    ])

    const city = await City.findOrFail(data.city_id)
    const district = await District.findOrFail(data.district_id)
    const region = await Region.findOrFail(data.region_id)
    const horary = await Horary.findOrFail(data.horary_id)
    const client = await Client.findOrFail(data.client_id)
    const photographer = await Photographer.findByOrFail(data.photographer_id)

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
      'accompanies',
      'drone',
      'region_id',
      'horary_id',
      'client_id',
      'actived'
    ])

    data.changed = true

    const city = await City.findOrFail(data.city_id)
    const district = await District.findOrFail(data.district_id)
    const region = await Region.findOrFail(data.region_id)
    const horary = await Horary.findOrFail(data.horary_id)
    const client = await Client.findOrFail(data.client_id)
    const photographer = await Photographer.findByOrFail(data.photographer_id)

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
