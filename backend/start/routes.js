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
Route.post('/calendar/event/list', 'GapiCalendarController.eventList')
Route.post(
  '/google/event/insertPhoto',
  'GapiCalendarController.insertEventPhoto'
)
Route.post(
  '/google/event/insertDrone',
  'GapiCalendarController.insertEventDrone'
)

Route.post('/google/auth/url', 'GapiAuthController.authUrl')
Route.post('/google/auth/first', 'GapiAuthController.authFirst')
Route.post('/google/auth/token', 'GapiAuthController.authToken')

Route.get('/broker/active', 'BrokerController.indexActive').middleware('auth')
Route.get('/city/active', 'CityController.indexActive').middleware('auth')
Route.get('/client/active', 'ClientController.indexActive').middleware('auth')
Route.get('/district/active', 'DistrictController.indexActive').middleware(
  'auth'
)
Route.get('/horary/active', 'HoraryController.indexActive').middleware('auth')
Route.get(
  '/photographer/active',
  'PhotographerController.indexActive'
).middleware('auth')
Route.get('/region/active', 'RegionController.indexActive').middleware('auth')

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

Route.get(
  'storages/storage/:storageType/folder/:folderName',
  'StorageController.getAllFilesFromFolder'
)
Route.get(
  'storages/storage/:storageType/folder/:folderName/:fileName/upload',
  'StorageController.getPutPreSignedUrl'
)
Route.get(
  'storages/storage/:storageType/folder/:folderName/:fileName/download',
  'StorageController.getDownloadPreSignedUrl'
)
