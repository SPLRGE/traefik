import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createFirstAccountValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  async index({ view }: HttpContext) {
    const users: User[] = await User.query()

    if (users.length === 0) return view.render('pages/auth/create-first-account')
    return view.render('pages/auth/login')
  }

  async setup({ request, response }: HttpContext) {
    const users: User[] = await User.query()
    if (users.length > 0) return response.redirect().toRoute('auth.index')

    const { email, password } = await request.validateUsing(createFirstAccountValidator)
    await User.create({ email, password })

    return response.redirect().toRoute('auth.index')
  }

  async login({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    return response.redirect().toRoute('dashboard.index')
  }

  async redirect({ ally }: HttpContext) {
    return ally.use('microsoft').redirect()
  }

  async callback({ ally, auth, response }: HttpContext) {
    const microsoft = ally.use('microsoft')

    if (microsoft.accessDenied() || microsoft.stateMisMatch() || microsoft.hasError())
      return response.redirect().toRoute('auth.index')

    const microsoftUser = await microsoft.user()

    let query = User.query().where((q) => q.where('ssoId', microsoftUser.id))
    if (microsoftUser.email)
      query = query.orWhere((q) =>
        q.where('email', microsoftUser.email!).andWhereNull('ssoId').andWhereNull('password')
      )

    let user = await query.first()

    if (!user) {
      const users: User[] = await User.query()

      if (users.length !== 0) return response.redirect().toRoute('auth.index')
      user = new User()
    }

    if (!user.ssoId) {
      user.ssoId = microsoftUser.id
      user.$isPersisted = false
    }

    if (microsoftUser.email && microsoftUser.email !== user.email) {
      user.email = microsoftUser.email
      user.$isPersisted = false
    }

    if (!user.$isPersisted) await user.save()

    await auth.use('web').login(user)
    return response.redirect().toRoute('dashboard.index')
  }
}
