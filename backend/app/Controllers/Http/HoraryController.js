'use strict'

const Horary = use('App/Models/Horary')

class HoraryController {
  async index({ request, response, view }) {
    const { photographer_id, dia_semana } = request.get()

    const query = Horary.query()

    if (photographer_id) {
      query.where('photographer_id', photographer_id)
    }

    if (dia_semana) {
      query.where('dia_semana', dia_semana)
    }

    return query.fetch()
  }

  async show({ params, request, response, view }) {
    const horary = await Horary.query()
      .where('id', params.id)
      .fetch()

    return horary
  }

  async store({ request, response }) {
    const data = request.only(['time', 'dia_semana', 'photographer_id'])

    const horary = await Horary.create(data)

    return horary
  }

  async update({ params, request, response }) {
    const horary = await Horary.findOrFail(params.id)
    const data = request.only(['time', 'dia_semana', 'photographer_id'])

    horary.merge(data)

    await horary.save()

    return horary
  }

  async destroy({ params, request, response }) {
    const horary = await Horary.findOrFail(params.id)

    await horary.delete()
  }
}

module.exports = HoraryController
