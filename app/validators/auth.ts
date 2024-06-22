import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string()
  })
)

export const createFirstAccountValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8)
  })
)
