'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Property extends Model {

  region () {
    return this.belongsTo('App/Models/Region')
  }

  client () {
    return this.belongsTo('App/Models/Client')
  }
  
  scheduling () {
    return this.hasMany('App/Models/Scheduling')
  }
}

module.exports = Property
