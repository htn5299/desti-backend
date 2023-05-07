import * as bcrypt from 'bcrypt'
export const hashPassword = async (rawPwd: string) => {
  const hashedPwd = bcrypt.hashSync(rawPwd, 10)
  return hashedPwd
}
export const compareHash = async (rawPwd: string, hashedPwd: string) => {
  return bcrypt.compareSync(rawPwd, hashedPwd)
}
