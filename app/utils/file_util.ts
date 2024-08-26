import { access } from 'node:fs/promises'

export const pathExists = async (path: string) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}
