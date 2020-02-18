'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientSchema extends Schema {
  up() {
    this.create('clients', table => {
      table.increments()
      table.string('name').notNullable()
      table.string('phone').notNullable()
      table
        .boolean('actived')
        .notNullable()
        .defaultTo(true)
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
      table
        .integer('broker_id')
        .unsigned()
        .references('id')
        .inTable('brokers')
      table.timestamps()
    })
  }

  down() {
    this.drop('clients')
  }
}

module.exports = ClientSchema
