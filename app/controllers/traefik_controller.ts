import type { HttpContext } from '@adonisjs/core/http'
import Certificate from "#models/certificate";
import app from "@adonisjs/core/services/app";

export default class TraefikController {

  public async config({ response }: HttpContext) {
    const config: {[k: string]: any} = {  }

    const certificates = await Certificate.all()
    config.tls = { certificates: [] }
    for(const certificate of certificates) {
      config.tls.certificates.push({
        certFile: app.tmpPath('traefik', 'certificates', `${certificate.id}.crt`),
        keyFile: app.tmpPath('traefik', 'certificates', `${certificate.id}.key`)
      })
    }

    return response.json(config)
  }
}
