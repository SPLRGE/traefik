import vine from '@vinejs/vine'

export const createCertificateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    key: vine.string(),
    certificate: vine.string(),
  })
)
