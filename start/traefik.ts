import { spawn } from 'node:child_process'
import app from "@adonisjs/core/services/app";
import logger from "@adonisjs/core/services/logger";
import got from "got";
import { createWriteStream } from "node:fs";
import {chmod, mkdir} from "node:fs/promises"
import { pathExists } from "../app/utils/file_util.js";
import {promisify} from "node:util";
import {pipeline} from "node:stream";

const traefikLogger = logger.use('traefik')
traefikLogger.info('Check if Traefik is installed')

const traefikPath = app.tmpPath('traefik')
const traefikServerPath = app.tmpPath('traefik', 'traefik-server.exe')

if (!await pathExists(traefikPath)) await mkdir(traefikPath)

if (!await pathExists(traefikServerPath)) {
  traefikLogger.info('Traefik not installed, downloading from SPLRGE s3')

  const downloadStream = got.stream('https://s3.splrge.dev/labs-public/traefik-proxy-manager/traefik-releases/traefik-v3.0.0')
  const writeStream = createWriteStream(traefikServerPath)

  try {
    await promisify(pipeline)(downloadStream, writeStream)
    await chmod(traefikServerPath, '755')
    traefikLogger.info('Traefik downloaded')
  } catch (e) {
    traefikLogger.error(`Failed to download Traefik: ${e}`)
    process.exit(1000)
  }
}


const traefik = spawn(traefikServerPath, [
  '--entryPoints.web.address=:80',
  '--entryPoints.websecure.address=:443',
  '--api.insecure=true',
  '--api.dashboard=true',
  '--accessLog=true',
  '--log.level=INFO',
])

traefik.stdout.on('data', (data) => {
  traefikLogger.info(`${data.toString().replace(/\n$/, '')}`)
})

traefik.stderr.on('data', (data) => {
  traefikLogger.info(`${data}`) //Traefik send everything to stderr
})

traefik.on('close', (code) => {
  traefikLogger.info(`Traefik server closed with code ${code}`)
})
