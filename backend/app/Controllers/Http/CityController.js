'use strict'

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
    const { name, services } = request.post()

    const city = await City.create({ name })

    if (services && services.length > 0) {
      await city.services().attach(services)
      city.services = await city.services().fetch()
    }

    return city
  }

  async update({ params, request, response }) {
    const city = await City.findOrFail(params.id)
    const { name, active, services } = request.post()

    city.merge({ name, active })

    await city.save()

    if (services) {
      await city.services().detach()
      await city.services().attach(services)
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
