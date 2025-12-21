import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import moment from "moment";

export interface CommuniqueEmailContext {
    title: string,
    description: string,
    severity: string,
    imageUrl: string,
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
    createdAt: string,
}

@Injectable()
export class EmailService {

    private readonly _logger = new Logger(EmailService.name);

    constructor(private readonly mailerService: MailerService) { }

    async sendWelcomeEmail(to: string, name: string) {
        await this.mailerService.sendMail({
            to,
            subject: "Bem-vindo!",
            template: "welcome", // welcome.hbs
            context: {
                name,
            },
        });
    }

    async sendResetPasswordEmail(to: string, link: string) {
        await this.mailerService.sendMail({
            to,
            subject: "Redefinição de senha",
            template: "reset-password",
            context: {
                link,
            },
        });
    }

    async sendCommunicationEmail(to: string[], context: CommuniqueEmailContext) {

        this._logger.log(`Enviando email de comunicado para ${to} com o título "${context.title}"`);

        await this.mailerService.sendMail({
            to,
            subject: `[${context.severity}] ${context.title}`,
            template: "communique",
            context: { 
                ...context,
                createdAt: moment(context.createdAt).utc(true).format('DD/MM/YYYY HH:mm'),
            },
        });
    }
}
