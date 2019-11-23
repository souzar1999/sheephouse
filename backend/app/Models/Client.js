'use strict'

const Model = use('Model')

class Client extends Model {
  
  property () {
    return this.hasMany('App/Models/Property')
  }
  
  broker () {
    return this.belongsTo('App/Models/Broker')
  }
}

module.exports = Client
