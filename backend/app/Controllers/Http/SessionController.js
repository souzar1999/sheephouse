'use strict'

class SessionController {
  async create({ request, auth }) {
    const { email, password } = request.all()

    const token = await auth.withRefreshToken().attempt(email, password)

    return token
  }

  async show({ auth }) {
    const user = auth.current.user

    return user
  }

  async refreshToken({ request, auth }) {
    const { refreshToken } = request.only(['refreshToken'])

    return await auth.generateForRefreshToken(refreshToken)
  }
}

module.exports = SessionController
