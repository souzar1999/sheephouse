'use strict'

const Photographer = use('App/Models/Photographer')
const Region = use('App/Models/Region')

class PhotographerController {
  async index ({ request, response, view }) {
    const photographers = Photographer.query()
                      .with('region')
                      .fetch()

    return photographers
  }

  async show ({ params, request, response, view }) {
    const photographer = await Photographer.findOrFail(params.id)
    
    await photographer.load("region")

    return photographer;
  }

  async store ({ request, response }) {
    const data = request.only([
      'name',
      'email',
      'drone',
      'region_id'
    ])

    const region = await Region.findOrFail(data.region_id)

    const photographer = await Photographer.create(data);

    photographer.region = region;

    return photographer
  }

  async update ({ params, request, response }) {
    const photographer = await Photographer.findOrFail(params.id);
    const data = request.only([
      'name',
      'email',
      'drone',
      'region_id'
    ])
    
    const region = await Region.findOrFail(data.region_id)

    photographer.merge(data);

    await photographer.save();

    photographer.region = region;
    
    return photographer
  }

  async destroy ({ params, request, response }) {
    const photographer = await Photographer.findOrFail(params.id)
    
    await photographer.delete();
  }
}

module.exports = PhotographerController
