'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Scheduling extends Model {
  client() {
    return this.belongsTo('App/Models/Client')
  }

  photographer() {
    return this.belongsTo('App/Models/Photographer')
  }

  services() {
    return this.belongsToMany('App/Models/Service')
    .pivotTable('scheduling_service')
    .withPivot(['price'])
  }
}

module.exports = Scheduling
