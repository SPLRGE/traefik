import env from '#start/env'
import { defineConfig } from '@adonisjs/ally'
import { MicrosoftService } from '@splrge/ally-microsoft-provider'

const allyConfig = defineConfig({
  /*discord: services.discord({
    clientId: env.get('DISCORD_CLIENT_ID'),
    clientSecret: env.get('DISCORD_CLIENT_SECRET'),
    callbackUrl: '',
  }),*/
  microsoft: MicrosoftService({
    clientId: env.get('MICROSOFT_CLIENT_ID', ''),
    clientSecret: env.get('MICROSOFT_CLIENT_SECRET', ''),
    callbackUrl: env.get('APP_URL') + '/auth/callback',
    authorizeUrl: `https://login.microsoftonline.com/${env.get('MICROSOFT_TENANT_ID', 'common')}/oauth2/v2.0/authorize`,
    accessTokenUrl: `https://login.microsoftonline.com/${env.get('MICROSOFT_TENANT_ID', 'common')}/oauth2/v2.0/token`,
    userInfoUrl:
      'https://graph.microsoft.com/v1.0' +
      (env.get('MICROSOFT_TENANT_ID') ? `/${env.get('MICROSOFT_TENANT_ID')}/` : '') +
      'me',
    scopes: ['openid', 'email', 'profile', 'offline_access'],
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
