'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SchedulingSchema extends Schema {
  up() {
    this.create('schedulings', table => {
      table.increments()
      table.string('date')
      table.datetime('date_cancel')
      table.string('latitude').notNullable()
      table.string('longitude').notNullable()
      table.string('address').notNullable()
      table.string('complement').notNullable()
      table.string('comments')
      table.string('google_event_id')
      table.boolean('accompanies').notNullable()
      table.boolean('drone', 9, 6).notNullable()
      table
        .boolean('actived')
        .notNullable()
        .defaultTo(true)
      table
        .boolean('changed')
        .notNullable()
        .defaultTo(false)
      table
        .boolean('completed')
        .notNullable()
        .defaultTo(false)
      table
        .integer('region_id')
        .unsigned()
        .references('id')
        .inTable('regions')
      table
        .integer('city_id')
        .unsigned()
        .references('id')
        .inTable('cities')
      table
        .integer('district_id')
        .unsigned()
        .references('id')
        .inTable('districts')
      table
        .integer('photographer_id')
        .unsigned()
        .references('id')
        .inTable('photographers')
      table
        .integer('horary_id')
        .unsigned()
        .references('id')
        .inTable('horaries')
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients')
      table.timestamps()
    })
  }

  down() {
    this.drop('schedulings')
  }
}

module.exports = SchedulingSchema
