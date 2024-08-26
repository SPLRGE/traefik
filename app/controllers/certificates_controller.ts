import type { HttpContext } from '@adonisjs/core/http'
import { createCertificateValidator } from '#validators/certificate'
import Certificate from '#models/certificate'
import { rm, writeFile } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'

export default class CertificatesController {
  async index({ view }: HttpContext) {
    const certificates = await Certificate.query().orderBy('id', 'asc')
    return view.render('pages/certs', {
      certificates: certificates.map((cert) => cert.serialize()),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createCertificateValidator)

    const certificate = await Certificate.create(payload)
    await writeFile(
      app.tmpPath('traefik', 'certificates', `${certificate.id}.crt`),
      certificate.certificate
    )
    await writeFile(
      app.tmpPath('traefik', 'certificates', `${certificate.id}.key`),
      certificate.key
    )

    session.flash('success', 'Certificate created successfully')
    return response.redirect().toRoute('dashboard.certs.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const certificate = await Certificate.findOrFail(params.id)
    await certificate.delete()

    await rm(app.tmpPath('traefik', 'certificates', `${certificate.id}.crt`))
    await rm(app.tmpPath('traefik', 'certificates', `${certificate.id}.key`))

    session.flash('success', 'Certificate deleted successfully')
    return response.redirect().toRoute('dashboard.certs.index')
  }
}
