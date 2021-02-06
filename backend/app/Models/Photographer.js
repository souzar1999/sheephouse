'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Photographer extends Model {
  region() {
    return this.belongsTo('App/Models/Region')
  }

  horary() {
    return this.hasMany('App/Models/Horary')
  }

  scheduling() {
    return this.hasMany('App/Models/Scheduling')
  }
}

module.exports = Photographer
