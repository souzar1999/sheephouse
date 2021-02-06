'use strict'

const Configuration = use('App/Models/Configuration')

class ConfigurationController {
  async index({ request, response, view }) {
    const configuration = Configuration.query().fetch()

    return configuration
  }

  async show({ params, request, response, view }) {
    const configuration = await Configuration.query()
      .where('id', params.id)
      .fetch()

    return configuration
  }

  async store({ request, response }) {
    const { maintenance } = request.post()

    const configuration = await Configuration.create({ maintenance })

    return configuration
  }

  async update({ params, request, response }) {
    const configuration = await Configuration.findOrFail(params.id)
    const { maintenance } = request.post()

    configuration.merge({ maintenance })

    await configuration.save()

    return configuration
  }

  async destroy({ params, request, response }) {
    const configuration = await Configuration.findOrFail(params.id)

    await configuration.delete()
  }
}

module.exports = ConfigurationController
