/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from "#controllers/auth_controller";
import {middleware} from "#start/kernel";
import CertificatesController from "#controllers/certificates_controller";
import TraefikController from "#controllers/traefik_controller";
import RoutesController from "#controllers/routes_controller";
import ServicesController from "#controllers/services_controller";

router.group(() => {
  router.get('/', [AuthController, 'index']).as('index')
  router.post('/', [AuthController, 'login']).as('login')
  
  router.post('/setup', [AuthController, 'setup']).as('setup')

  router.get('/redirect', [AuthController, 'redirect']).as('redirect')
  router.get('/callback', [AuthController, 'callback']).as('callback')
}).prefix('/auth').as('auth')

router.group(() => {
  router.on('/').render('pages/home').as('index')
  router.resource('/routes', RoutesController).only(['index', 'store', 'destroy']).as('routes')
  router.resource('/services', ServicesController).only(['index', 'store', 'destroy']).as('services')
  router.resource('/certs', CertificatesController).only(['index', 'store', 'destroy']).as('certs')
}).as('dashboard').use(middleware.auth())

router.group(() => {
  router.get('/config.json', [TraefikController, 'config']).as('config')
}).as('api').prefix('/api')