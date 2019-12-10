'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionSchema extends Schema {
  up() {
    this.create('regions', table => {
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
    this.drop('regions')
  }
}

module.exports = RegionSchema
