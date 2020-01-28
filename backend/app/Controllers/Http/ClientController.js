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

  async indexActive({ request, response, view }) {
    const clients = Client.query()
      .with('broker')
      .with('user')
      .with('scheduling')
      .where('active', true)
      .fetch()

    return clients
  }

  async show({ params, request, response }) {
    const client = await Client.query()
      .where('id', params.id)
      .with('broker')
      .with('user')
      .with('scheduling')
      .fetch()

    return client
  }

  async showClient({ params, request, response }) {
    const client = await Client.query()
      .where('user_id', params.user_id)
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

    return await Client.create(data)
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

    return (client = await Client.query()
      .where('id', params.id)
      .with('broker')
      .with('user')
      .fetch())
  }

  async destroy({ params, request, response }) {
    const client = await Client.findOrFail(params.id)

    await client.delete()
  }
}

module.exports = ClientController
