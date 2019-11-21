'use strict'

const Route = use('Route')

Route.post('/users', 'UserController.create')
Route.post('/sessions', 'SessionController.create')

Route.resource('photographer', 'PhotographerController')
  .apiOnly()
  .middleware('auth')