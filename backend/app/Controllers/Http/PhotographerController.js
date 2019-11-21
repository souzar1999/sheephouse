'use strict'

const Photographer = use('App/Models/Photographer')

class PhotographerController {
  async index ({ request, response, view }) {
    const photographer = Photographer.all()

    return photographer
  }

  async show ({ params, request, response, view }) {
    const photographer = await Photographer.findOrFail(params.id)

    return photographer;
  }

  async store ({ request, response }) {
    const data = request.only([
      'name',
      'email',
      'drone',
      'region_id'
    ])

    const photographer = await Photographer.create(data);

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
    
    photographer.merge(data);

    await photographer.save();
    
    return photographer
  }

  async destroy ({ params, request, response }) {
    const photographer = await Photographer.findOrFail(params.id)
    
    await photographer.delete();
  }
}

module.exports = PhotographerController
