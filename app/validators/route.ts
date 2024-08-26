import vine from '@vinejs/vine'

export const createRouteValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    tls: vine.boolean(),
    rules: vine.string(),
    service: vine.string(), //TODO: Add exist rule
    serviceName: vine.string().optional().requiredWhen('service', '=', 'add-new'),
    serviceAddress: vine.string().optional().requiredWhen('service', '=', 'add-new'),
    serviceType: vine
      .enum(['HTTP', 'HTTPS', 'TCP', 'UDP'])
      .optional()
      .requiredWhen('service', '=', 'add-new'),
  })
)
