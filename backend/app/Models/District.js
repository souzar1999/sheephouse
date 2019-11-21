'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class District extends Model {
  
  region () {
    return this.belongsTo('App/Models/Region')
  }
}

module.exports = District
