'use strict'

class SessionController {
  async create({ request, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)

    return token
  }

  async show({ auth }) {
    const user = auth.current.user

    return user
  }
}

module.exports = SessionController
