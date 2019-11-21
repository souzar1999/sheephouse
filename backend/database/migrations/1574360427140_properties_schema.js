'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PropertiesSchema extends Schema {
  up () {
    this.create('properties', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.decimal('latitude', 9, 6).notNullable()
      table.decimal('longitude', 9, 6).notNullable()
      table
        .integer('region_id')
        .unsigned()
        .references('id')
        .inTable('regions')
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients')
      table.timestamps()
    })
  }

  down () {
    this.drop('properties')
  }
}

module.exports = PropertiesSchema
