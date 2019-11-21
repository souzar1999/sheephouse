'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Photographer extends Model {
  
  region () {
    return this.belongsTo('App/Models/Region')
  }
  
  scheduling () {
    return this.hasMany('App/Models/Scheduling')
  }
}

module.exports = Photographer
