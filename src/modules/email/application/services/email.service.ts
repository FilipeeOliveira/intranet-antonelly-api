import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import moment from "moment";

export interface CommuniqueEmailContext {
    isUpdate?: boolean;
    title: string;
    description: string;
    severity: string;
    imageUrl?: string;
    sector: {
        name: string;
        id: string;
        description: string;
    };
    author: {
        name: string;
        id: string;
        sector: {
            name: string;
            id: string;
            description: string;
        };
        email: string;
        role: {
            id: string;
            description: string;
            key: string;
        };
    };
    createdAt: string;
}

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly mailerService: MailerService) {
        this.logger.log("EmailService initialized");
    }

    /**
     * Envia email de boas-vindas
     * (mantém assinatura para compatibilidade)
     */
    async sendWelcomeEmail(to: string, context: {
        name: string,
        email: string,
        temporaryPassword: string
    }): Promise<void> {
        this.logger.log(`Enviando email de boas-vindas para: ${to}`);

        await this.mailerService.sendMail({
            to,
            subject: "Bem-vindo!",
            template: "welcome",
            context
        });

        this.logger.log(`Email de boas-vindas enviado para: ${to}`);
    }

    /**
     * Envia email de redefinição de senha
     * (mantém assinatura para compatibilidade)
     */
    async sendResetPasswordEmail(to: string, link: string): Promise<void> {
        this.logger.log(`Enviando email de redefinição de senha para: ${to}`);

        await this.mailerService.sendMail({
            to,
            subject: "Redefinição de senha",
            template: "reset-password",
            context: {
                link,
            },
        });

        this.logger.log(`Email de redefinição de senha enviado para: ${to}`);
    }

    /**
     * Envia email de comunicado para múltiplos usuários
     */
    async sendCommunicationEmail(
        to: string[],
        context: CommuniqueEmailContext,
    ): Promise<void> {
        this.logger.log(
            `Enviando comunicado "${context.title}" para ${to.length} destinatários`,
        );

        await this.mailerService.sendMail({
            to,
            subject: `${context?.isUpdate ? '(Atualização de Comunicado) ' : ''}[${context.severity}] ${context.title}`,
            template: "communique",
            context: {
                ...context,
                isUpdate: context?.isUpdate,
                createdAt: moment(context.createdAt)
                    .utc(true)
                    .format("DD/MM/YYYY HH:mm"),
            },
        });

        this.logger.log(
            `Comunicado "${context.title}" enviado com sucesso`,
        );
    }

    sendTemporaryPasswordEmail(
        email: string,
        data: { userName: string; email: string; temporaryPassword: string },
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    //   /**
    //    * Teste de conexão SMTP
    //    * (mantém compatibilidade conceitual com mock antigo)
    //    */
    //   async testEmailConnection(): Promise<boolean> {
    //     this.logger.log("Testando conexão de email...");

    //     try {
    //       await this.mailerService.verify();
    //       this.logger.log("✅ Conexão SMTP verificada com sucesso");
    //       return true;
    //     } catch (error) {
    //       this.logger.error("❌ Falha ao verificar conexão SMTP", error);
    //       return false;
    //     }
    //   }
}
