'use strict'

const Client = use('App/Models/Client')
const User = use('App/Models/User')
const Broker = use('App/Models/Broker')

class ClientController {
  async index({ request, response, view }) {
    const clients = Client.query()
      .with('broker')
      .with('user')
      .with('scheduling')
      .fetch()

    return clients
  }

  async show({ params, request, response, view }) {
    const client = await Client.query()
      .where('id', params.id)
      .with('broker')
      .with('user')
      .with('scheduling')
      .fetch()

    return client
  }

  async store({ request, response }) {
    const data = request.only([
      'broker_id',
      'user_id',
      'name',
      'phone',
      'active'
    ])

    await Client.create(clientData)

    return const client = await Client.query()
      .where('id', params.id)
      .with('broker')
      .with('user')
      .fetch()
  }

  async update({ params, request, response }) {
    const data = request.only([
      'broker_id',
      'user_id',
      'name',
      'phone',
      'active'
    ])

    const client = await Client.findOrFail(params.id)

    client.merge(data)

    await client.save()

    return const client = await Client.query()
      .where('id', params.id)
      .with('broker')
      .with('user')
      .fetch()
  }

  async destroy({ params, request, response }) {
    const client = await Client.findOrFail(params.id)

    await client.delete()
  }
}

module.exports = ClientController
