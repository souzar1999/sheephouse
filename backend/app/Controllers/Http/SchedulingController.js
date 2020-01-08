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
      'address',
      'latitude',
      'longitude',
      'accompanies',
      'drone',
      'horary_id',
      'client_id',
      'complement'
    ])

    const dataCity = request.only(['city'])
    const dataDistrict = request.only(['district'])

    const city = await Database.select('id')
      .from('cities')
      .where('name', dataCity.city)

    const district = await Database.select('id', 'region_id')
      .from('districts')
      .where('name', dataDistrict.district)
      .where('city_id', city[0].id)

    const region = await Region.findOrFail(district[0].region_id)
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
    data.city_id = city[0].id
    data.region_id = district[0].region_id
    data.district_id = district[0].id

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
      'horary_id',
      'photographer_id',
      'city_id',
      'region_id',
      'district_id',
      'scheduling_id',
      'active',
      'changed',
      'complement'
    ])

    const horary = await Horary.findOrFail(data.horary_id)
    const client = await Client.findOrFail(data.client_id)

    if (data.drone) {
      var photographer = await Photographer.findByOrFail('drone', data.drone)
      data.photographer_id = photographer.id
    }

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
