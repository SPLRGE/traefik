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
    clientId: env.get('MICROSOFT_CLIENT_ID'),
    clientSecret: env.get('MICROSOFT_CLIENT_SECRET'),
    callbackUrl: env.get('APP_URL') + '/auth/callback',
    authorizeUrl: 'https://login.microsoftonline.com/cc89672c-6f50-4af7-bb83-f9ce9b05b80e/oauth2/v2.0/authorize',
    accessTokenUrl: 'https://login.microsoftonline.com/cc89672c-6f50-4af7-bb83-f9ce9b05b80e/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/cc89672c-6f50-4af7-bb83-f9ce9b05b80e/me',
    scopes: ['openid', 'email', 'profile', 'offline_access']
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
