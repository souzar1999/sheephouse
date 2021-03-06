'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DistrictSchema extends Schema {
  up() {
    this.create('districts', table => {
      table.increments()
      table.string('name').notNullable()
      table
        .boolean('active')
        .notNullable()
        .defaultTo(true)
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
      table.timestamps()
    })
  }

  down() {
    this.drop('districts')
  }
}

module.exports = DistrictSchema
