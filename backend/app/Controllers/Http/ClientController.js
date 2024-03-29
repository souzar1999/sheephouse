'use strict'

const Client = use('App/Models/Client'),
  User = use('App/Models/User'),
  Broker = use('App/Models/Broker'),
  Mail = use('Mail'),
  Database = use('Database')

class ClientController {
  async index({ request, response, view }) {
    const clients = Client.query()
      .with('broker')
      .with('user')
      .orderBy('name', 'asc')
      .fetch()

    return clients
  }

  async indexActive({ request, response, view }) {
    const clients = Client.query()
      .with('broker')
      .with('user')
      .where('actived', true)
      .orderBy('name', 'asc')
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
      .where('actived', true)
      .fetch()

    return client
  }

  async showClientByEmail({ params, request, response }) {
    const user = await Database
      .table('users')
      .where('email', params.email)
      .first()
    if(user){
      const client = await Database
        .table('clients')
        .where('user_id', user.id)
        .where('actived', true)
        .first()

        return client
    } else {

      return null;
    }

  }

  async store({ request, response }) {
    const data = request.only([
      'broker_id',
      'user_id',
      'name',
      'phone',
      'actived'
    ])

    return await Client.create(data)
  }

  async update({ params, request, response }) {
    const data = request.only(['name', 'phone', 'broker_id', 'actived'])

    const dataUser = request.only(['email'])

    const client = await Client.findOrFail(params.id),
      user = await User.findOrFail(client.user_id),
      admin = await User.findByOrFail('admin', true)

    let enviarEmail = false

    if (!client.$attributes.actived && data.actived) {
      enviarEmail = true
    }

    if (user.$attributes.email !== dataUser.email) {
      user.merge(dataUser)
      await user.save()
    }

    client.merge(data)

    await client.save()

    return client
  }

  async destroy({ params, request, response }) {
    const client = await Client.findOrFail(params.id)

    await client.delete()
  }
}

module.exports = ClientController
