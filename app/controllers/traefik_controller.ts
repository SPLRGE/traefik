import type { HttpContext } from '@adonisjs/core/http'
import Certificate from "#models/certificate";
import app from "@adonisjs/core/services/app";
import Service from "#models/service";
import Route from "#models/route";

export default class TraefikController {

  public async config({ response }: HttpContext) {
    const config: {[k: string]: any} = {  }

    const certificates = await Certificate.all()
    if(certificates.length > 0) {
      config.tls = {
        certificates: certificates.map(cert => ({
          certFile: app.tmpPath('traefik', 'certificates', `${cert.id}.crt`),
          keyFile: app.tmpPath('traefik', 'certificates', `${cert.id}.key`)
        }))
      }
    }

    const httpConfiguration: {[k: string]: any} = {  }

    const services = await Service.all()
    if(services.length > 0) {
      httpConfiguration.services = {  }

      for (const service of services) {
        if (service.type === 'HTTP' || service.type === 'HTTPS') {
          httpConfiguration.services[service.id] = {
            loadBalancer: {
              servers: service.addresses.map(address => ({url: `${service.type.toLowerCase()}://${address}`}))
            }
          }
        }
      }
    }

    const routes = await Route.all()
    if(routes.length > 0) {
      httpConfiguration.routers = {  }

      for(const route of routes) {
        httpConfiguration.routers[route.id] = {
          rule: route.rules,
          service: route.serviceId,
        }

        if(route.tls) httpConfiguration.routers[route.id].tls = {  }
      }
    }

    if(Object.keys(httpConfiguration).length > 0) config.http = httpConfiguration
    return response.json(config)
  }
}
