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
Route.post('/google/event/insertEvent', 'GapiCalendarController.insertEvent')
Route.post('/google/event/cancelEvent', 'GapiCalendarController.cancelEvent')
Route.post('/google/event/editEvent', 'GapiCalendarController.editEvent')

Route.post('/google/auth/url', 'GapiAuthController.authUrl')
Route.post('/google/auth/first', 'GapiAuthController.authFirst')
Route.post('/google/auth/token', 'GapiAuthController.authToken')

Route.get('/broker/active', 'BrokerController.indexActive').middleware('auth')
Route.get('/city/active', 'CityController.indexActive').middleware('auth')
Route.get('/client/active', 'ClientController.indexActive').middleware('auth')
Route.get('/district/active', 'DistrictController.indexActive').middleware(
  'auth'
)
Route.get(
  '/horary/photographer/:photographer_id',
  'HoraryController.photographerHoraries'
).middleware('auth')

Route.get(
  '/photographer/active',
  'PhotographerController.indexActive'
).middleware('auth')
Route.get('/region/active', 'RegionController.indexActive').middleware('auth')

Route.post(
  '/photographer/byRegion',
  'PhotographerController.showPhotographer'
).middleware('auth')
Route.get(
  '/photographer/sabado',
  'PhotographerController.showPhotographerSabado'
).middleware('auth')

Route.get(
  '/scheduling/byClient/:client_id',
  'SchedulingController.indexClient'
).middleware('auth')

Route.get(
  '/scheduling/completed/month/:dateIni/:dateEnd',
  'SchedulingController.indexMonthCompleted'
).middleware('auth')

Route.get(
  '/scheduling/canceled/month/:dateIni/:dateEnd',
  'SchedulingController.indexMonthCanceled'
).middleware('auth')

Route.get('/scheduling/day/:date', 'SchedulingController.indexDay').middleware(
  'auth'
)

Route.get(
  '/scheduling/:id/complete',
  'SchedulingController.completeAndSendEmail'
).middleware('auth')
Route.get(
  '/scheduling/:id/resend',
  'SchedulingController.resendEmail'
).middleware('auth')
Route.post(
  '/scheduling/event/sendEmail',
  'SchedulingController.sendEmailWithoutEvent'
)

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

Route.resource('service', 'ServiceController')
  .apiOnly()
  .middleware('auth')

Route.resource('property', 'PropertyController')
  .apiOnly()
  .middleware('auth')

Route.resource('region', 'RegionController')
  .apiOnly()
  .middleware('auth')

Route.resource('configuration', 'ConfigurationController').apiOnly()

Route.resource('scheduling', 'SchedulingController').apiOnly()

Route.post('/resetPassword', 'ResetPasswordController.store')
Route.post('/forgotPassword', 'ForgotPasswordController.store')
Route.get('emails.forgotpassword', ({ view }) => {
  return view.render('emails/forgotpassword')
})
