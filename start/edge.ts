import edge from 'edge.js'
import { DateTime } from 'luxon'
import env from '#start/env'

edge.global('luxon', DateTime)
edge.global('microsoft', {
  enabled: env.get('MICROSOFT_CLIENT_ID') && env.get('MICROSOFT_CLIENT_SECRET'),
})
