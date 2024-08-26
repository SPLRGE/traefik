import type { HttpContext } from '@adonisjs/core/http'
import Route from '#models/route'
import { createRouteValidator } from '#validators/route'
import Service from '#models/service'

export default class RoutesController {
  async index({ view }: HttpContext) {
    const routes = await Route.query().orderBy('id', 'asc')
    const services = await Service.query().orderBy('id', 'asc')

    return view.render('pages/routes', {
      routes: routes.map((route) => route.serialize()),
      services: services.map((service) => service.serialize()),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createRouteValidator)

    let service: Service
    if (payload.service !== 'add-new') service = await Service.findOrFail(payload.service)
    else
      service = await Service.create({
        name: payload.serviceName,
        rawAddresses: payload.serviceAddress,
        type: payload.serviceType,
      })

    await Route.create({
      name: payload.name,
      tls: payload.tls,
      rules: payload.rules,
      serviceId: service.id,
    })

    session.flash('success', 'Route created successfully')
    return response.redirect().toRoute('dashboard.routes.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const route = await Route.findOrFail(params.id)
    await route.delete()

    session.flash('success', 'Route deleted successfully')
    return response.redirect().toRoute('dashboard.routes.index')
  }
}
