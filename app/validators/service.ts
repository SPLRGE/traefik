import vine from '@vinejs/vine'

export const createServiceValidator = vine.compile(
  vine.object({
    name: vine.string(),
    address: vine.string(),
    type: vine.enum(['HTTP', 'HTTPS', 'TCP', 'UDP']),
  })
)
