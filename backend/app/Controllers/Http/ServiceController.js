'use strict'

const Service = use('App/Models/Service')

class ServiceController {
  async index({ request, response, view }) {
    const service = Service.query().fetch()

    return service
  }

  async show({ params, request, response, view }) {
    const service = await Service.query()
      .where('id', params.id)
      .first()

    return service
  }

  async store({ request, response }) {
    const data = request.only(['name'])

    const service = await Service.create(data)

    return service
  }

  async update({ params, request, response }) {
    const service = await Service.findOrFail(params.id)
    const data = request.only(['name'])

    service.merge(data)

    await service.save()

    return service
  }

  async destroy({ params, request, response }) {
    const service = await Service.findOrFail(params.id)

    await service.delete()
  }
}

module.exports = ServiceController
