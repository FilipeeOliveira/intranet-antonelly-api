import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import moment from "moment";
import { envConfig } from "src/config/config";

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
    INFO: { label: 'Informativo', color: '#10b981' },
    WARNING: { label: 'Atenção', color: '#f97316' },
};

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
        try {
            this.logger.log(`Enviando email de boas-vindas para: ${to}`);

            await this.mailerService.sendMail({
                to,
                subject: "Bem-vindo!",
                template: "welcome",
                context: {
                    ...context,
                    loginUrl: `${envConfig.FRONTEND_URL}/login`,
                    year: new Date().getFullYear(),
                },
            });

            this.logger.log(`Email de boas-vindas enviado para: ${to}`);
        }
        catch (err) {
            this.logger.error(`Não foi possível completar o envio de e-mail. Segue o Tracer de Erro: `, err);
        }
    }

    /**
     * Envia email de redefinição de senha (com senha temporária - usado pelo admin)
     * (mantém assinatura para compatibilidade)
     */
    sendResetPasswordEmail(email: string, data: { name: string; email: string; temporaryPassword: string }) {
        this.mailerService.sendMail({
            to: email,
            subject: 'Redefinição de Senha',
            template: 'reset-password',
            context: {
                ...data,
                year: new Date().getFullYear(),
            },
        })
            .then(() => {
                this.logger.log(`Email de redefinição de senha enviado para: ${email}`);
            })
            .catch((error) => {
                this.logger.error(`Erro ao enviar email de redefinição de senha para: ${email}`, error);
            });
    }

    /**
     * Envia email de recuperação de senha com link (fluxo "esqueci minha senha")
     */
    async sendForgotPasswordEmail(email: string, data: { name: string; resetLink: string }): Promise<void> {
        this.logger.log(`Enviando email de recuperação de senha para: ${email}`);

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Recuperação de Senha - Intranet Antonelly',
                template: 'forgot-password',
                context: {
                    ...data,
                    year: new Date().getFullYear(),
                },
            });

            this.logger.log(`Email de recuperação de senha enviado para: ${email}`);
        } catch (error) {
            this.logger.error(`Erro ao enviar email de recuperação de senha para: ${email}`, error);
            throw error;
        }
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

        const severityInfo = SEVERITY_CONFIG[context.severity] || { label: context.severity, color: '#71717a' };

        await this.mailerService.sendMail({
            to,
            subject: `${context?.isUpdate ? '(Atualização de Comunicado) ' : ''}[${severityInfo.label}] ${context.title}`,
            template: "communique",
            context: {
                ...context,
                isUpdate: context?.isUpdate,
                severityLabel: severityInfo.label,
                severityColor: severityInfo.color,
                createdAt: moment(context.createdAt)
                    .utc(true)
                    .format("DD/MM/YYYY HH:mm"),
                year: new Date().getFullYear(),
            },
        });

        this.logger.log(
            `Comunicado "${context.title}" enviado com sucesso`,
        );
    }
}
