import { Injectable, Logger } from '@nestjs/common';

export interface EmailTemplateData {
  userName: string;
  email: string;
  temporaryPassword?: string;
  resetToken?: string;
  resetUrl?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.logger.log('EmailService initialized - Mock mode active');
  }

  async sendTemporaryPasswordEmail(
    email: string, 
    data: EmailTemplateData
  ): Promise<void> {
    this.logger.log(`[MOCK EMAIL] Enviando senha temporária para: ${email}`);
    this.logger.log(`[MOCK EMAIL] Nome: ${data.userName}`);
    this.logger.log(`[MOCK EMAIL] Senha temporária: ${data.temporaryPassword}`);
    
    // TODO: Implementar integração com serviço de email real
    // Exemplo: SendGrid, Nodemailer, AWS SES, etc.
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.logger.log(`[MOCK EMAIL] Email enviado com sucesso (simulado)`);
  }

  async sendPasswordResetEmail(
    email: string, 
    data: EmailTemplateData
  ): Promise<void> {
    this.logger.log(`[MOCK EMAIL] Enviando recuperação de senha para: ${email}`);
    this.logger.log(`[MOCK EMAIL] Nome: ${data.userName}`);
    this.logger.log(`[MOCK EMAIL] Token de reset: ${data.resetToken}`);
    this.logger.log(`[MOCK EMAIL] URL de reset: ${data.resetUrl}`);
    
    // TODO: Implementar integração com serviço de email real
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.logger.log(`[MOCK EMAIL] Email enviado com sucesso (simulado)`);
  }

  async sendWelcomeEmail(
    email: string, 
    data: EmailTemplateData
  ): Promise<void> {
    this.logger.log(`[MOCK EMAIL] Enviando boas-vindas para: ${email}`);
    this.logger.log(`[MOCK EMAIL] Nome: ${data.userName}`);
    
    // TODO: Implementar integração com serviço de email real
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.logger.log(`[MOCK EMAIL] Email enviado com sucesso (simulado)`);
  }

  // Método para testar configuração de email quando implementar
  async testEmailConnection(): Promise<boolean> {
    this.logger.log('[MOCK EMAIL] Testando conexão de email...');
    
    // TODO: Implementar teste real de conexão
    
    this.logger.log('[MOCK EMAIL] ✅ Conexão OK (simulado)');
    return true;
  }
}