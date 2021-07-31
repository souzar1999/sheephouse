'use strict'
const Database = use('Database')
const Broker = use('App/Models/Broker')

class BrokerController {
  async index({ request, response, view }) {
    const broker = Broker.query()
      .with('client')
      .with('services')
      .fetch()

    return broker
  }

  async indexActive({ request, response, view }) {
    const broker = Broker.query()
      .with('client')
      .with('services')
      .where('active', true)
      .fetch()

    return broker
  }

  async show({ params, request, response, view }) {
    const broker = await Broker.query()
      .where('id', params.id)
      .with('client')
      .with('services')
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
      services,
      prices
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
      services,
      prices
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

    if (services) {
      await broker.services().detach()
      await broker.services().attach(services)

      services.map(async (service_id, index) => {
        await Database.table('broker_service')
          .where('service_id', service_id)
          .where('broker_id', params.id)
          .update('price', prices[index])
      })

      broker.services = await broker.services().fetch()
    }

    return broker
  }

  async destroy({ params, request, response }) {
    const broker = await Broker.findOrFail(params.id)

    await broker.delete()
  }
}

module.exports = BrokerController
