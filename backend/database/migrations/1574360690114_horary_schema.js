'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HorarySchema extends Schema {
  up() {
    this.create('horaries', table => {
      table.increments()
      table.time('time', { precision: 6 })
      table
        .boolean('active')
        .notNullable()
        .defaultTo(true)
      table.timestamps()
    })
  }

  down() {
    this.drop('horaries')
  }
}

module.exports = HorarySchema
