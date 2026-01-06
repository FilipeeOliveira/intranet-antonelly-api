import { Injectable, Logger } from "@nestjs/common";
import { CommuniqueEmailContext, EmailService } from "src/modules/email/application/services/email.service";
import { UsersService } from "src/modules/users/application/services/users.service";

@Injectable()
export class SendEmailCommuniqueBySector {
    constructor(
        private readonly emailService: EmailService,
        private readonly usersService: UsersService,
    ) { }

    private readonly logger = new Logger(SendEmailCommuniqueBySector.name);

    async execute(sectorId: string, context: CommuniqueEmailContext) {
        const users = await this.usersService.findAllBySector(sectorId);

        if (users.length === 0) {
            this.logger.warn(`No users found in sector with ID: ${sectorId}. Email not sent.`);
            return;
        }

        const to = users.map(user => user?.email)
        this.emailService.sendCommunicationEmail(to, context);
    }
}