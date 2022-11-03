'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class City extends Model {
  district() {
    return this.hasMany('App/Models/District')
  }

  services() {
    return this.belongsToMany('App/Models/Service')
      .pivotTable('city_service')
      .withPivot(['price'])
  }
}

module.exports = City
