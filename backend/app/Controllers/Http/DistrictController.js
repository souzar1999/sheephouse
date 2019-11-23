'use strict'

const District = use('App/Models/District')
const Region = use('App/Models/Region')

class DistrictController {
  async index ({ request, response, view }) {
    const districts = District.query()
                      .with('region')
                      .fetch()

    return districts
  }

  async show ({ params, request, response, view }) {
    const district = await District.findOrFail(params.id)
    
    await district.load("region")

    return district;
  }

  async store ({ request, response }) {
    const data = request.only([
      'name',
      'region_id'
    ])

    const region = await Region.findOrFail(data.region_id)

    const district = await District.create(data);

    district.region = region;

    return district
  }

  async update ({ params, request, response }) {
    const district = await District.findOrFail(params.id);
    const data = request.only([
      'name',
      'region_id'
    ])
    
    const region = await Region.findOrFail(data.region_id)

    district.merge(data);

    await district.save();

    district.region = region;
    
    return district
  }

  async destroy ({ params, request, response }) {
    const district = await District.findOrFail(params.id)
    
    await district.delete();
  }
}

module.exports = DistrictController
