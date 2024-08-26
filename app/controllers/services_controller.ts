import type { HttpContext } from '@adonisjs/core/http'
import Service from '#models/service'
import { createServiceValidator } from '#validators/service'

export default class ServicesController {
  async index({ view }: HttpContext) {
    const services = await Service.query().orderBy('id', 'asc')

    return view.render('pages/services', {
      services: services.map((service) => service.serialize()),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createServiceValidator)

    await Service.create(payload)

    session.flash('success', 'Service created successfully')
    return response.redirect().toRoute('dashboard.services.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const service = await Service.findOrFail(params.id)
    await service.delete()

    session.flash('success', 'Service deleted successfully')
    return response.redirect().toRoute('dashboard.services.index')
  }
}
