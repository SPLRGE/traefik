import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {

  public async redirect({ ally }: HttpContext) {
    return ally.use('microsoft').redirect()
  }

  public async callback({ ally, response }: HttpContext) {
    const microsoft = ally.use('microsoft')

    if(microsoft.accessDenied() || microsoft.stateMisMatch() || microsoft.hasError())
      return response.redirect().toPath('https://splrge.dev')

    const user = await microsoft.user()
    return user
  }

}
