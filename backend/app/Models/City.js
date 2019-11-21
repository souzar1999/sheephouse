'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class City extends Model {
  
  region () {
    return this.hasMany('App/Models/Region')
  }
}

module.exports = City
