'use strict'

const Route = use('Route')

Route.post('/users', 'UserController.create')
Route.post('/sessions', 'SessionController.create')

Route.resource('broker', 'BrokerController')
  .apiOnly()
  .middleware('auth')