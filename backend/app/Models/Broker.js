'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Broker extends Model {

  client () {
    return this.hasMany('App/Models/Client')
  }
}

module.exports = Broker
