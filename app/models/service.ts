import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: 'HTTP' | 'HTTPS' | 'UDP' | 'TCP'

  @column({ columnName: 'addresses' })
  declare rawAddresses: string

  @computed()
  get addresses() {
    return this.rawAddresses.split(',')
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
