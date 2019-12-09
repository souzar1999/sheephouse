'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BrokerSchema extends Schema {
  up() {
    this.create('brokers', table => {
      table.increments()
      table.string('name').notNullable()
      table
        .boolean('active')
        .notNullable()
        .defaultTo(true)
      table.timestamps()
    })
  }

  down() {
    this.drop('brokers')
  }
}

module.exports = BrokerSchema
