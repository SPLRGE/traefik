/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const CertificatesController = () => import('#controllers/certificates_controller')
const TraefikController = () => import('#controllers/traefik_controller')
const RoutesController = () => import('#controllers/routes_controller')
const ServicesController = () => import('#controllers/services_controller')

router
  .group(() => {
    router.get('/', [AuthController, 'index']).as('index')
    router.post('/', [AuthController, 'login']).as('login')

    router.post('/setup', [AuthController, 'setup']).as('setup')

    router.get('/redirect', [AuthController, 'redirect']).as('redirect')
    router.get('/callback', [AuthController, 'callback']).as('callback')
  })
  .prefix('/auth')
  .as('auth')

router
  .group(() => {
    router.on('/').render('pages/home').as('index')
    router.resource('/routes', RoutesController).only(['index', 'store', 'destroy']).as('routes')
    router
      .resource('/services', ServicesController)
      .only(['index', 'store', 'destroy'])
      .as('services')
    router
      .resource('/certs', CertificatesController)
      .only(['index', 'store', 'destroy'])
      .as('certs')
  })
  .as('dashboard')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/config.json', [TraefikController, 'config']).as('config')
  })
  .as('api')
  .prefix('/api')
