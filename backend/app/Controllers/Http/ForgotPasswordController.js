'use strict'

const { randomBytes } = require('crypto')
const { promisify } = require('util')

const Mail = use('Mail')
const Env = use('Env')

const User = use('App/Models/User')
const Client = use('App/Models/Client')

class ForgotPasswordController {
  async store({ request }) {
    const email = request.input('email')

    const user = await User.findByOrFail('email', email),
      client = await Client.findByOrFail('user_id', user.id),
      admin = await User.findByOrFail('admin', true),
      random = await promisify(randomBytes)(24),
      token = random.toString('hex')

    await user.tokens().create({
      token,
      type: 'forgotPassword'
    })

    const resetPasswordUrl = `${Env.get('FRONT_URL')}/reset?token=${token}`
  }
}

module.exports = ForgotPasswordController
