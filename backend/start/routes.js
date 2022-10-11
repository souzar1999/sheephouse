'use strict'

const Route = use('Route')

Route.post('/users', 'UserController.create')

Route.post('/sessions', 'SessionController.create')
Route.post('/refresh', 'SessionController.refreshToken')

Route.get('/user', 'SessionController.show').middleware('auth')

Route.get('/boleto', 'JunoController.makeCharges')

Route.get('/client/user/:user_id', 'ClientController.showClient')
Route.get('/client/email/:email', 'ClientController.showClientByEmail')

Route.post('/city/byName', 'CityController.showCity')

Route.post('/district/byName', 'DistrictController.showDistrict')
Route.post('/calendar/event/list', 'GapiCalendarController.eventList')
Route.post('/google/event/insertEvent', 'GapiCalendarController.insertEvent')
Route.post('/google/event/cancelEvent', 'GapiCalendarController.cancelEvent')
Route.post('/google/event/editEvent', 'GapiCalendarController.editEvent')

Route.post('/google/auth/url', 'GapiAuthController.authUrl')
Route.post('/google/auth/first', 'GapiAuthController.authFirst')
Route.post('/google/auth/token', 'GapiAuthController.authToken')

Route.get('/broker/active', 'BrokerController.indexActive')
Route.get('/city/active', 'CityController.indexActive')
Route.get('/client/active', 'ClientController.indexActive')
Route.get('/district/active', 'DistrictController.indexActive')
Route.get(
  '/horary/photographer/:photographer_id',
  'HoraryController.photographerHoraries'
)

Route.get('/photographer/active', 'PhotographerController.indexActive')
Route.get('/region/active', 'RegionController.indexActive')

Route.post('/photographer/byRegion', 'PhotographerController.showPhotographer')
Route.get(
  '/photographer/sabado',
  'PhotographerController.showPhotographerSabado'
)

Route.get('/scheduling/byClient/:client_id', 'SchedulingController.indexClient')

Route.get(
  '/scheduling/completed/month/:dateIni/:dateEnd',
  'SchedulingController.indexMonthCompleted'
)

Route.get(
  '/scheduling/canceled/month/:dateIni/:dateEnd',
  'SchedulingController.indexMonthCanceled'
)

Route.get('/scheduling/day/:date', 'SchedulingController.indexDay')

Route.get(
  '/scheduling/:id/complete',
  'SchedulingController.completeAndSendEmail'
)
Route.get('/scheduling/:id/resend', 'SchedulingController.resendEmail')
Route.post(
  '/scheduling/event/sendEmail',
  'SchedulingController.sendEmailWithoutEvent'
)

Route.resource('broker', 'BrokerController').apiOnly()

Route.resource('city', 'CityController').apiOnly()

Route.resource('client', 'ClientController').apiOnly()

Route.resource('district', 'DistrictController').apiOnly()

Route.resource('horary', 'HoraryController').apiOnly()

Route.resource('photographer', 'PhotographerController').apiOnly()

Route.resource('service', 'ServiceController').apiOnly()

Route.resource('property', 'PropertyController').apiOnly()

Route.resource('region', 'RegionController').apiOnly()

Route.resource('configuration', 'ConfigurationController').apiOnly()

Route.resource('scheduling', 'SchedulingController').apiOnly()

Route.post('/resetPassword', 'ResetPasswordController.store')
Route.post('/forgotPassword', 'ForgotPasswordController.store')
Route.get('emails.forgotpassword', ({ view }) => {
  return view.render('emails/forgotpassword')
})
