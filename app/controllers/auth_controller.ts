import type { HttpContext } from '@adonisjs/core/http'
import User from "#models/user";

export default class AuthController {
  constructor() {
  }

  public async redirect({ ally }: HttpContext) {
    return ally.use('microsoft').redirect()
  }

  public async callback({ ally, auth, response }: HttpContext) {
    const microsoft = ally.use('microsoft')

    if(microsoft.accessDenied() || microsoft.stateMisMatch() || microsoft.hasError())
      return response.redirect().toPath('https://splrge.dev')

    const microsoftUser = await microsoft.user()
    const user = await User.firstOrNew({ ssoId: microsoftUser.id }, { ssoId: microsoftUser.id })

    if(!user.$isPersisted) await user.save()

    await auth.use('web').login(user)
    return response.redirect().toRoute('dashboard.index')
  }

}
