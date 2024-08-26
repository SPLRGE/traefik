import { Logger } from '@adonisjs/core/logger'
import logger from '@adonisjs/core/services/logger'
import { pathExists } from '../app/utils/file_util.js'
import { chmod, mkdir, rm, writeFile } from 'node:fs/promises'
import got from 'got'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import app from '@adonisjs/core/services/app'
import Certificate from '#models/certificate'
import Traefik from '../app/traefik/instance.js'
import { promisify } from 'node:util'

export default class TraefikProvider {
  private LOGGER: Logger = new Logger({})
  private TRAEFIK_INSTANCE: Traefik | null = null

  /**
   * Register bindings to the container
   */
  //register() {}

  /**
   * The container bindings have booted
   */
  //async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    this.LOGGER = logger.use('traefik')
  }

  /**
   * The process has been started
   */
  async ready() {
    if (app.getEnvironment() !== 'web') return

    const LOGGER: Logger = this.LOGGER
    const PATH = {
      TRAEFIK: app.tmpPath('traefik'),
      TRAEFIK_SERVER: app.tmpPath('traefik', 'traefik-server.exe'),
      CERTS: app.tmpPath('traefik', 'certificates'),
    }

    LOGGER.info('Check if Traefik is installed...')
    if (!(await pathExists(PATH.TRAEFIK))) await mkdir(PATH.TRAEFIK)

    if (!(await pathExists(PATH.TRAEFIK_SERVER))) {
      LOGGER.info('Traefik not installed, downloading from SPLRGE S3')

      const downloadStream = got.stream(
        'https://s3.splrge.dev/labs-public/traefik-proxy-manager/traefik-releases/traefik-v3.0.0'
      )
      const writeStream = createWriteStream(PATH.TRAEFIK_SERVER)

      try {
        await promisify(pipeline)(downloadStream, writeStream)
        await chmod(PATH.TRAEFIK_SERVER, '755')
        LOGGER.info('Traefik installed successfully')
      } catch (e) {
        LOGGER.error('Unable to download Traefik: ' + e)
        process.exit(1000)
      }
    }

    LOGGER.info('Preparing SSL certificates')
    if (await pathExists(PATH.CERTS)) await rm(PATH.CERTS, { recursive: true })
    await mkdir(PATH.CERTS)

    const certificates = await Certificate.all()
    for (const certificate of certificates) {
      await writeFile(
        app.tmpPath('traefik', 'certificates', `${certificate.id}.crt`),
        certificate.certificate
      )
      await writeFile(
        app.tmpPath('traefik', 'certificates', `${certificate.id}.key`),
        certificate.key
      )
    }

    LOGGER.info('Starting Traefik server...')

    this.TRAEFIK_INSTANCE = new Traefik(PATH.TRAEFIK_SERVER, LOGGER)
    await this.TRAEFIK_INSTANCE.start()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    this.LOGGER.info('Shutting down Traefik server...')
    await this.TRAEFIK_INSTANCE?.shutdown()
  }
}
