'use strict'

const Database = use('Database')
const Horary = use('App/Models/Horary')
const Client = use('App/Models/Client')
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
      'address',
      'latitude',
      'longitude',
      'accompanies',
      'drone',
      'horary_id',
      'client_id'
    ])

    const dataCity = request.only(['city'])
    const dataDistrict = request.only(['district'])

    const city = await Database.select('id')
      .from('cities')
      .where('name', dataCity.city)

    const regions = await Database.select('id')
      .from('regions')
      .where('city_id', city[0].id)

    const district = await Database.select('region_id')
      .from('districts')
      .where('name', dataDistrict.district)
      .whereIn('region_id', regions)

    const horary = await Horary.findOrFail(data.horary_id)
    const client = await Client.findOrFail(data.client_id)

    if (data.drone) {
      var photographer = await Photographer.findByOrFail('drone', data.drone)
    } else {
      var photographer = await Photographer.findByOrFail(
        'region_id',
        district[0].region_id
      )
    }

    data.photographer_id = photographer.id

    const scheduling = await Scheduling.create(data)

    scheduling.horary = horary
    scheduling.client = client
    scheduling.photographer = photographer

    return scheduling
  }

  async update({ params, request, response }) {
    const scheduling = await Scheduling.findOrFail(params.id)
    const data = request.only([
      'date',
      'address',
      'latitude',
      'longitude',
      'accompanies',
      'drone',
      'horary_id',
      'scheduling_id'
    ])

    const horary = await Horary.findOrFail(data.horary_id)

    if (data.drone) {
      const photographer = await Photographer.findByOrFail('drone', 'true')
    } else {
      const protographer = await Photographer.findByOrFail(
        'region_id',
        `${property.region_id}`
      )
    }

    scheduling.merge(data)

    await scheduling.save()

    scheduling.horary = horary
    scheduling.photographer = photographer

    return scheduling
  }

  async destroy({ params, request, response }) {
    const scheduling = await Scheduling.findOrFail(params.id)

    await scheduling.delete()
  }
}

module.exports = SchedulingController
