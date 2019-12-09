'use strict'

const City = use('App/Models/City')

class CityController {
  async index({ request, response, view }) {
    const city = City.query()
      .with('region', region => {
        region.with('district')
      })
      .orderBy('name')
      .fetch()

    return city
  }

  async show({ params, request, response, view }) {
    const city = await City.query()
      .where('id', params.id)
      .with('region', region => {
        region.with('district')
      })
      .fetch()

    return city
  }

  async store({ request, response }) {
    const data = request.only(['name'])

    const city = await City.create(data)

    return await City.query()
      .where('id', city.id)
      .with('region', region => {
        region.with('district')
      })
      .fetch()
  }

  async update({ params, request, response }) {
    const city = await City.findOrFail(params.id)
    const data = request.only(['name'])

    city.merge(data)

    await city.save()

    return await City.query()
      .where('id', city.id)
      .with('region', region => {
        region.with('district')
      })
      .fetch()
  }

  async destroy({ params, request, response }) {
    const city = await City.findOrFail(params.id)

    await city.delete()
  }
}

module.exports = CityController
