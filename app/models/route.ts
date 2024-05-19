import { DateTime } from 'luxon'
import {BaseModel, column, hasOne} from '@adonisjs/lucid/orm'
import Service from "#models/service";
import type {HasOne} from "@adonisjs/lucid/types/relations";

export default class Route extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare rules: string

  @column()
  declare tls: boolean

  @column()
  declare serviceId: number

  @hasOne(() => Service, { localKey: 'serviceId', foreignKey: 'id' })
  declare service: HasOne<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
