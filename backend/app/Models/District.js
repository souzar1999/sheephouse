'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class District extends Model {
  region() {
    return this.belongsTo('App/Models/Region')
  }

  city() {
    return this.belongsTo('App/Models/City')
  }
}

module.exports = District
