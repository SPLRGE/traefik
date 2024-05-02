import type { HttpContext } from '@adonisjs/core/http'
import {createCertificateValidator} from "#validators/certificate";
import Certificate from "#models/certificate";

export default class CertificatesController {

  async index({ view }: HttpContext) {
    const certificates = await Certificate.query().orderBy('id', 'asc')
    return view.render('pages/certs', { certificates: certificates.map(cert => cert.serialize()) })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createCertificateValidator)

    await Certificate.create(payload)

    session.flash('success', 'Certificate created successfully')
    return response.redirect().toRoute('dashboard.certs.index')
  }
}
