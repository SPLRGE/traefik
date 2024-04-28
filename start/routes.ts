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

router.on('/').render('pages/home')

router.group(() => {
  router.get('/redirect', [AuthController, 'redirect'])
  router.get('/callback', [AuthController, 'callback'])
}).prefix('/auth')


