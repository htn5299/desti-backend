import { CodeResetEntity } from '../utils/typeorm'

export interface ICodeReset {
  validateCode(code: string): Promise<CodeResetEntity>

  generateCode(email: string): Promise<CodeResetEntity>

  deleteCode(code: string): Promise<null>
}
