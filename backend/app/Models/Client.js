'use strict'

const Model = use('Model')

class Client extends Model {
  scheduling() {
    return this.hasMany('App/Models/Scheduling')
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  broker() {
    return this.belongsTo('App/Models/Broker')
  }
}

module.exports = Client
