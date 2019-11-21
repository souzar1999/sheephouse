'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Horary extends Model {

  scheduling () {
    return this.hasMany('App/Models/Scheduling')
  }
}

module.exports = Horary
