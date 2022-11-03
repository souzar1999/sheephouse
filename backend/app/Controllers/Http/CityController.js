'use strict'

const Database = use('Database')
const City = use('App/Models/City')

class CityController {
  async index({ request, response, view }) {
    const city = City.query()
      .with('district')
      .with('services')
      .fetch()

    return city
  }

  async indexActive({ request, response, view }) {
    const city = City.query()
      .with('district')
      .with('services')
      .where('active', true)
      .fetch()

    return city
  }

  async show({ params, request, response, view }) {
    const city = await City.query()
      .where('id', params.id)
      .with('district')
      .with('services')
      .fetch()

    return city
  }

  async showCity({ params, request, response }) {
    const data = request.only(['city'])

    const city = await City.query()
      .with('services')
      .where('name', data.city)
      .where('active', true)
      .fetch()

    return city
  }

  async store({ request, response }) {
    const { name } = request.post()

    const city = await City.create({ name })

    return city
  }

  async update({ params, request, response }) {
    const city = await City.findOrFail(params.id)
    const { name, active, services, prices } = request.post()

    city.merge({ name, active })

    await city.save()

    if (services) {
      await city.services().detach()

      services.map(async (service_id, index) => {
        await city.services().attach(service_id)
        await Database.table('city_service')
          .where('service_id', service_id)
          .where('city_id', params.id)
          .update('price', prices[index])
      })

      city.services = await city.services().fetch()
    }

    return city
  }

  async destroy({ params, request, response }) {
    const city = await City.findOrFail(params.id)

    await city.delete()
  }
}

module.exports = CityController
