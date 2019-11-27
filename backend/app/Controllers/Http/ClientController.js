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
    const data = request.only(['username', 'email', 'password'])

    const clientData = request.only(['broker_id', 'name'])

    const user = await User.create(data)

    clientData.user_id = user.id

    const broker = await Broker.findOrFail(clientData.broker_id)

    const client = await Client.create(clientData)

    client.broker = broker
    client.user = user

    return client
  }

  async destroy({ params, request, response }) {
    const client = await Client.findOrFail(params.id)

    await client.delete()
  }
}

module.exports = ClientController
