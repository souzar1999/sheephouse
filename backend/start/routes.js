'use strict'

const Route = use('Route')

Route.post('/users', 'UserController.create')

Route.post('/sessions', 'SessionController.create')
Route.post('/refresh', 'SessionController.refreshToken')

Route.get('/user', 'SessionController.show').middleware('auth')

Route.get('/client/user/:user_id', 'ClientController.showClient').middleware(
  'auth'
)

Route.post('/city/byName', 'CityController.showCity').middleware('auth')

Route.post('/district/byName', 'DistrictController.showDistrict').middleware(
  'auth'
)

Route.post(
  '/photographer/byRegion',
  'PhotographerController.showPhotographer'
).middleware('auth')

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
