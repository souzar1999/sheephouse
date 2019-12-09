'use strict'

const Route = use('Route')

Route.post('/users', 'UserController.create')

Route.post('/sessions', 'SessionController.create')
Route.get('/user', 'SessionController.show').middleware('auth')

Route.resource('broker', 'BrokerController')
  .apiOnly()
  .middleware('auth')

Route.resource('city', 'CityController')
  .apiOnly()
  .middleware('auth')

Route.resource('client', 'ClientController').apiOnly()

Route.resource('district', 'DistrictController')
  .apiOnly()
  .middleware('auth')

Route.resource('horary', 'HoraryController')
  .apiOnly()
  .middleware('auth')

Route.resource('photographer', 'PhotographerController')
  .apiOnly()
  .middleware('auth')

Route.resource('property', 'PropertyController')
  .apiOnly()
  .middleware('auth')

Route.resource('region', 'RegionController')
  .apiOnly()
  .middleware('auth')

Route.resource('scheduling', 'SchedulingController')
  .apiOnly()
  .middleware('auth')
