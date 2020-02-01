'use strict'

const District = use('App/Models/District')
const City = use('App/Models/City')

class DistrictController {
  async index({ request, response, view }) {
    const districts = District.query()
      .with('city')
      .fetch()

    return districts
  }

  async indexActive({ request, response, view }) {
    const districts = District.query()
      .with('city')
      .where('active', true)
      .fetch()

    return districts
  }

  async show({ params, request, response, view }) {
    const district = await District.query()
      .where('id', params.id)
      .with('city')
      .fetch()

    return district
  }

  async showDistrict({ params, request, response }) {
    const data = request.only(['city_id', 'district'])

    const district = await District.query()
      .where('name', data.district)
      .where('city_id', data.city_id)
      .fetch()

    return district
  }

  async store({ request, response }) {
    const data = request.only(['name', 'region_id', 'city_id'])

    const city = await City.findOrFail(data.city_id)

    const district = await District.create(data)

    return district
  }

  async update({ params, request, response }) {
    const district = await District.findOrFail(params.id)
    const data = request.only(['name', 'region_id', 'city_id', 'active'])

    const city = await City.findOrFail(data.city_id)

    district.merge(data)

    await district.save()

    return district
  }

  async destroy({ params, request, response }) {
    const district = await District.findOrFail(params.id)

    await district.delete()
  }
}

module.exports = DistrictController
