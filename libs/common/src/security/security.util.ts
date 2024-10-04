/* eslint-disable @typescript-eslint/no-var-requires */
import { createHash, randomBytes } from 'crypto';
const { nanoid } = require('fix-esm').require('nanoid');

export class SecurityUtils {
  static generateMaskedUrl(baseUrl: string): string {
    return `${baseUrl}/l/${nanoid(6)}`;
  }

  static generatePassword(): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256').update(salt).digest('hex');
    return salt + ':' + hash;
  }

  static verifyHashedPassword(hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const inputHash = createHash('sha256').update(salt).digest('hex');
    return hash === inputHash;
  }
}
