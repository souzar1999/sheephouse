'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Scheduling extends Model {
  
  horary () {
    return this.belongsTo('App/Models/Horary')
  }

  client () {
    return this.belongsTo('App/Models/Client')
  }
  
  photographer () {
    return this.belongsTo('App/Models/Photographer')
  }
}

module.exports = Scheduling
