'use strict'

const Client = use('App/Models/Client'),
  User = use('App/Models/User'),
  Broker = use('App/Models/Broker'),
  Mail = use('Mail')

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

  async store({ request, response }) {
    const data = request.only([
      'broker_id',
      'user_id',
      'name',
      'phone',
      'actived'
    ])

    const user = await User.findOrFail(data.user_id),
      admin = await User.findByOrFail('admin', true)

    return await Client.create(data).then(async res => {
      await Mail.send(
        'emails.addClient',
        {
          client: res.$attributes,
          user
        },
        message => {
          message
            .to(admin.email)
            .from('noreply@sheephouse.com.br', 'Sheep House')
            .subject('Sheep House - Cliente cadastrado')
        }
      )
    })
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

    await client.save().then(async res => {
      if (enviarEmail) {
        await Mail.send(
          'emails.activeClient',
          {
            client,
            admin
          },
          message => {
            message
              .to(user.email)
              .cc(admin.email)
              .from('noreply@sheephouse.com.br', 'Sheep House')
              .subject('Sheep House - Cadastro ativado')
          }
        )
      }
    })

    return client
  }

  async destroy({ params, request, response }) {
    const client = await Client.findOrFail(params.id)

    await client.delete()
  }
}

module.exports = ClientController
