import type { HttpContext } from '@adonisjs/core/http'

export default class CertificatesController {

  async index({ view }: HttpContext) {
    return view.render('certs')
  }

  async store({ response }: HttpContext) {
    return response.internalServerError({ unimplemented: true })
  }
}
