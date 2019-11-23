'use strict'

const Route = use('Route')

Route.post('/users', 'UserController.create')
Route.post('/sessions', 'SessionController.create')

Route.resource('city', 'CityController')
  .apiOnly()
  .middleware('auth')
  
Route.resource('region', 'RegionController')
  .apiOnly()
  .middleware('auth')
  
Route.resource('district', 'DistrictController')
  .apiOnly()
  .middleware('auth')

Route.resource('horary', 'HoraryController')
  .apiOnly()
  .middleware('auth')

  Route.resource('broker', 'BrokerController')
    .apiOnly()
    .middleware('auth')

Route.resource('client', 'ClientController')
  .apiOnly()
  .middleware('auth')
      
    