import * as crypto from 'crypto';

export class PasswordUtil {
  /**
   * Gera uma senha temporária segura
   * @param length Comprimento da senha (padrão: 12)
   * @returns Senha temporária
   */
  static generateTemporaryPassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '@#$!%*?&';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = '';
    
    // Garantir pelo menos um caractere de cada tipo
    password += lowercase[crypto.randomInt(0, lowercase.length)];
    password += uppercase[crypto.randomInt(0, uppercase.length)];
    password += numbers[crypto.randomInt(0, numbers.length)];
    password += symbols[crypto.randomInt(0, symbols.length)];
    
    // Preencher o restante aleatoriamente
    for (let i = 4; i < length; i++) {
      password += allChars[crypto.randomInt(0, allChars.length)];
    }
    
    // Embaralhar a senha
    return password
      .split('')
      .sort(() => crypto.randomInt(0, 2) - 0.5)
      .join('');
  }

  /**
   * Valida se uma senha atende aos critérios de segurança
   * @param password Senha a ser validada
   * @returns Object com resultado da validação
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Senha deve conter pelo menos um símbolo (@$!%*?&)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}