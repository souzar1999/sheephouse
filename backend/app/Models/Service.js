'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Service extends Model {
  brokers() {
    return this.belongsToMany('App/Models/Broker').pivotTable('broker_service')
  }

  cities() {
    return this.belongsToMany('App/Models/City').pivotTable('city_service')
  }

  schedulings() {
    return this.belongsToMany('App/Models/Scheduling').pivotTable(
      'scheduling_service'
    )
  }
}

module.exports = Service
