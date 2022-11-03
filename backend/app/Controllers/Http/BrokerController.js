'use strict'
const Database = use('Database')
const Broker = use('App/Models/Broker')

class BrokerController {
  async index({ request, response, view }) {
    const broker = Broker.query()
      .with('client')
      .orderBy('name', 'asc')
      .fetch()

    return broker
  }

  async indexActive({ request, response, view }) {
    const broker = Broker.query()
      .with('client')
      .where('active', true)
      .orderBy('name', 'asc')
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
    const {
      name,
      email,
      cnpj,
      emitir_nf,
      emitir_boleto,
      enviar_nf,
      enviar_relatorio,
      dia_vencimento,
    } = request.post()

    const broker = await Broker.create({
      name,
      email,
      cnpj,
      emitir_nf,
      emitir_boleto,
      enviar_nf,
      enviar_relatorio,
      dia_vencimento
    })

    return broker
  }

  async update({ params, request, response }) {
    const broker = await Broker.findOrFail(params.id)
    const {
      name,
      email,
      active,
      cnpj,
      emitir_nf,
      emitir_boleto,
      enviar_nf,
      enviar_relatorio,
      dia_vencimento,
    } = request.post()

    broker.merge({
      name,
      email,
      active,
      cnpj,
      emitir_nf,
      emitir_boleto,
      enviar_nf,
      enviar_relatorio,
      dia_vencimento
    })

    await broker.save()

    return broker
  }

  async destroy({ params, request, response }) {
    const broker = await Broker.findOrFail(params.id)

    await broker.delete()
  }
}

module.exports = BrokerController
