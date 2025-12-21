import { Injectable } from "@nestjs/common";
import { EmailService } from "src/modules/email/application/services/email.service";

export interface SendWelcomeEmailContext {
    name: string,
    email: string,
    temporaryPassword: string,
}

@Injectable()
export class SendWelcomeEmailUseCase {

    constructor(
        private readonly emailService: EmailService
    ) { }

    async execute(args: { to: string, context: SendWelcomeEmailContext }): Promise<void> {
        const { to, context } = args;

        this.emailService.sendWelcomeEmail(to, context);
    }
}