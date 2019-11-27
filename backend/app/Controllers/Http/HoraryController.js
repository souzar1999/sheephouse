'use strict'

const Horary = use('App/Models/Horary')

class HoraryController {
  async index ({ request, response, view }) {
    const horary = Horary.query()
      .with('schedulings')
      .fetch()

    return horary
  }

  async show ({ params, request, response, view }) {
    const horary = await Horary.query()
      .where('id', params.id)   
      .with('schedulings')
      .fetch()

    return horary;
  }

  async store ({ request, response }) {
    const data = request.only([
      'time'
    ])

    const horary = await Horary.create(data);

    return horary;
  }

  async update ({ params, request, response }) {
    const horary = await Horary.findOrFail(params.id);
    const data = request.only([
      'time'
    ])
    
    horary.merge(data);

    await horary.save();
    
    return horary
  }

  async destroy ({ params, request, response }) {
    const horary = await Horary.findOrFail(params.id)
    
    await horary.delete();
  }
}

module.exports = HoraryController
