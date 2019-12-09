'use strict'

const Broker = use('App/Models/Broker')

class BrokerController {
  async index({ request, response, view }) {
    const broker = Broker.query()
      .with('client')
      .fetch()

    return broker
  }

  async show({ params, request, response, view }) {
    const broker = await Broker.query()
      .where('id', params.id)
      .with('client')
      .fetch()

    return broker
  }

  async store({ request, response }) {
    const data = request.only(['name', 'active'])

    const broker = await Broker.create(data)

    return broker
  }

  async update({ params, request, response }) {
    const broker = await Broker.findOrFail(params.id)
    const data = request.only(['name', 'active'])

    broker.merge(data)

    await broker.save()

    return broker
  }

  async inactive({ params, request, response }) {
    const broker = await Broker.findOrFail(params.id)
    
    const data.active = false 
    
    broker.merge(data)

    await broker.save()

    return broker
  }

  async destroy({ params, request, response }) {
    const broker = await Broker.findOrFail(params.id)

    await broker.delete()
  }
}

module.exports = BrokerController
