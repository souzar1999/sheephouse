'use strict'

const Client = use('App/Models/Client')
const Broker = use('App/Models/Broker')

class ClientController {
  async index ({ request, response, view }) {
    const clients = Client.query()
                      .with('broker')
                      .fetch()

    return clients
  }

  async show ({ params, request, response, view }) {
    const client = await Client.findOrFail(params.id)
    
    await client.load("broker")

    return client;
  }

  async store ({ request, response }) {
    const data = request.only([
      'name',
      'email',
      'broker_id'
    ])

    const broker = await Broker.findOrFail(data.broker_id)

    const client = await Client.create(data);

    client.broker = broker;

    return client
  }

  async update ({ params, request, response }) {
    const client = await Client.findOrFail(params.id);
    const data = request.only([
      'name',
      'email',
      'broker_id'
    ])
    
    const broker = await Broker.findOrFail(data.broker_id)

    client.merge(data);

    await client.save();

    client.broker = broker;
    
    return client
  }

  async destroy ({ params, request, response }) {
    const client = await Client.findOrFail(params.id)
    
    await client.delete();
  }
}

module.exports = ClientController
