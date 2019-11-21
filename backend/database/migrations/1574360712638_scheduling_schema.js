'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SchedulingSchema extends Schema {
  up () {
    this.create('schedulings', (table) => {
      table.increments()
      table.string('date').notNullable()
      table.boolean('accompanies').notNullable()
      table.boolean('drone', 9, 6).notNullable()
      table
        .integer('photographer_id')
        .unsigned()
        .references('id')
        .inTable('photographers')
      table
        .integer('propertie_id')
        .unsigned()
        .references('id')
        .inTable('properties')
      table
        .integer('horary_id')
        .unsigned()
        .references('id')
        .inTable('horaries')
      table.timestamps()
    })
  }

  down () {
    this.drop('schedulings')
  }
}

module.exports = SchedulingSchema
