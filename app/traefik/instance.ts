import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
import { Logger } from '@adonisjs/core/logger'

export default class Traefik {
  protected PROCESS: ChildProcessWithoutNullStreams | null = null

  constructor(
    protected executablePath: string,
    protected logger: Logger
  ) {}

  async start() {
    this.PROCESS = spawn(this.executablePath, [
      '--entryPoints.web.address=:80',
      '--entryPoints.websecure.address=:443',
      '--api.insecure=true',
      '--api.dashboard=true',
      '--providers.http.endpoint=http://127.0.0.1:3333/api/config.json',
      '--accessLog=true',
      '--log.level=INFO',
    ])

    this.PROCESS.stdout.on('data', (data) => {
      this.logger.info(`${data.toString().replace(/\n$/, '')}`)
    })

    this.PROCESS.stderr.on('data', (data) => {
      this.logger.info(`${data.toString().replace(/\n$/, '')}`)
    })

    this.PROCESS.on('close', (code) => {
      this.logger.info(`Traefik process exited with code ${code}`)
    })
  }

  async shutdown() {
    this.PROCESS?.kill()
  }
}
