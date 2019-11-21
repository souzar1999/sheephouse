'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Region extends Model {
  
  district () {
    return this.hasMany('App/Models/District')
  }
  
  city () {
    return this.belongsTo('App/Models/City')
  }
}

module.exports = Region
