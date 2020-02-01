'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PhotographersSchema extends Schema {
  up () {
    this.table('photographers', (table) => {
      // alter table
    })
  }

  down () {
    this.table('photographers', (table) => {
      // reverse alternations
    })
  }
}

module.exports = PhotographersSchema
