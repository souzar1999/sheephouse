'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PhotographerSchema extends Schema {
  up() {
    this.create('photographers', table => {
      table.increments()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.json('tokens')
      table
        .boolean('drone')
        .notNullable()
        .defaultTo(false)
      table
        .boolean('sabado')
        .notNullable()
        .defaultTo(false)
      table
      table
        .boolean('active')
        .notNullable()
        .defaultTo(true)
      table
        .integer('region_id')
        .unsigned()
        .references('id')
        .inTable('regions')
      table.timestamps()
    })
  }

  down() {
    this.drop('photographers')
  }
}

module.exports = PhotographerSchema
