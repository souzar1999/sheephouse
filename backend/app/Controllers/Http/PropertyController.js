'use strict'

const Property = use('App/Models/Property')
const Client = use('App/Models/Client')
const Region = use('App/Models/Region')

class PropertyController {
  async index ({ request, response, view }) {
    const properties = Property.query()
                      .with('client')
                      .with('region')
                      .fetch()

    return properties
  }

  async show ({ params, request, response, view }) {
    const property = await Property.findOrFail(params.id)
    
    await property.load("client")
    await property.load("region")

    return property;
  }

  async store ({ request, response }) {
    const data = request.only([
      'name',
      'description',
      'latitude',
      'longitude',
      'client_id',
      'region_id'
    ])

    const client = await Client.findOrFail(data.client_id)
    const region = await Region.findOrFail(data.region_id)

    const property = await Property.create(data);

    property.client = client;
    property.region = region;

    return property
  }

  async update ({ params, request, response }) {
    const property = await Property.findOrFail(params.id);
    const data = request.only([
      'name',
      'description',
      'latitude',
      'longitude',
      'client_id',
      'region_id'
    ])
    
    const client = await Client.findOrFail(data.client_id)
    const region = await Region.findOrFail(data.region_id)

    property.merge(data);

    await property.save();

    property.client = client;
    property.region = region;
    
    return property
  }

  async destroy ({ params, request, response }) {
    const property = await Property.findOrFail(params.id)
    
    await property.delete();
  }
}

module.exports = PropertyController
