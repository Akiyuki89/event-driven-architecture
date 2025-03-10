import * as bcrypt from 'bcrypt';

export class EncryptHelper {
  private static readonly saltRounds = 10;

  static async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(EncryptHelper.saltRounds);
    return bcrypt.hash(password, salt);
  }

  static async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
