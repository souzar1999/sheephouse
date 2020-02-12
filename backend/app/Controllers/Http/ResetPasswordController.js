'use strict'

const User = use('App/Models/User')
const Token = use('App/Models/Token')

class ResetPasswordController {
  async store({ request, response }) {
    const { token, email, password } = request.only([
      'token',
      'email',
      'password'
    ])

    const resetToken = await Token.findByOrFail({
        token: token,
        is_revoked: false,
        type: 'forgotPassword'
      }),
      user = await resetToken.User().fetch()

    if (user.email == email) {
      user.password = password
      resetToken.is_revoked = true

      await user.save()
      await resetToken.save()

      return response
        .status(200)
        .send({ success: { message: 'Senha trocada com sucesso!' } })
    } else {
      return response
        .status(403)
        .send({ error: { message: 'Problemas ao trocar senha!' } })
    }
  }
}

module.exports = ResetPasswordController
