'use strict'

const Region = use('App/Models/Region')
const City = use('App/Models/City')

class RegionController {
  async index ({ request, response, view }) {
    const regions = Region.query()
                      .with('city')
                      .fetch()

    return regions
  }

  async show ({ params, request, response, view }) {
    const region = await Region.findOrFail(params.id)
    
    await region.load("city")

    return region;
  }

  async store ({ request, response }) {
    const data = request.only([
      'name',
      'city_id'
    ])

    const city = await City.findOrFail(data.city_id)

    const region = await Region.create(data);

    region.city = city;

    return region
  }

  async update ({ params, request, response }) {
    const region = await Region.findOrFail(params.id);
    const data = request.only([
      'name',
      'city_id'
    ])
    
    const city = await City.findOrFail(data.city_id)

    region.merge(data);

    await region.save();

    region.city = city;
    
    return region
  }

  async destroy ({ params, request, response }) {
    const region = await Region.findOrFail(params.id)
    
    await region.delete();
  }
}

module.exports = RegionController
