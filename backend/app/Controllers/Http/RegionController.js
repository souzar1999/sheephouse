'use strict'

const Region = use('App/Models/Region')
const City = use('App/Models/City')

class RegionController {
  async index({ request, response }) {
    const regions = Region.query()
      .with('district')
      .fetch()

    return regions
  }
  async indexActive({ request, response }) {
    const regions = Region.query()
      .with('district')
      .where('active', true)
      .fetch()

    return regions
  }

  async show({ params, request, response }) {
    const region = await Region.query()
      .where('id', params.id)
      .with('district')
      .fetch()

    return region
  }

  async store({ request, response }) {
    const data = request.only(['name'])
    const region = await Region.create(data)

    return region
  }

  async update({ params, request, response }) {
    const region = await Region.findOrFail(params.id)
    const data = request.only(['name'])

    region.merge(data)

    await region.save()

    return region
  }

  async destroy({ params, request, response }) {
    const region = await Region.findOrFail(params.id)

    await region.delete()
  }
}

module.exports = RegionController
