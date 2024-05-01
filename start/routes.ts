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

router.group(() => {
  router.get('/redirect', [AuthController, 'redirect']).as('redirect')
  router.get('/callback', [AuthController, 'callback']).as('callback')
}).prefix('/auth').as('auth')

router.group(() => {
  router.on('/').render('pages/home').as('index')
  router.on('/certs').render('pages/certs').as('certs')
}).as('dashboard').use(middleware.auth())
