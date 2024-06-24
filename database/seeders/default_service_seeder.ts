import Service from '#models/service'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment: string[] = ['production', 'development', 'testing']

  async run() {
    await Service.updateOrCreateMany('id', [
      {
        id: 1,
        name: '[default] App',
        type: 'HTTP',
        rawAddresses: 'http://localhost:3333'
      },
      {
        id: 2,
        name: '[default] Traefik Dashboard',
        type: 'HTTP',
        rawAddresses: 'http://localhost:8080'
      }
    ])
  }
}