import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export const hashPassword = async (rawPwd: string) => {
  return bcrypt.hashSync(rawPwd, 10)
}
export const compareHash = async (rawPwd: string, hashedPwd: string) => {
  return bcrypt.compareSync(rawPwd, hashedPwd)
}

export const generateUUIDV4 = () => uuidv4()
export const slugString = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;'
  const to = 'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}
export const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers['authorization']?.split(' ') ?? []
  return type === 'Bearer' ? token : undefined
}
