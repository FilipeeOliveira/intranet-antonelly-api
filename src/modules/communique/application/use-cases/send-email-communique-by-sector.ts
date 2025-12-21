import { Injectable } from "@nestjs/common";
import { CommuniqueEmailContext, EmailService } from "src/modules/email/application/services/email.service";
import { UsersService } from "src/modules/users/application/services/users.service";

@Injectable()
export class SendEmailCommuniqueBySector {
    constructor(
        private readonly emailService: EmailService,
        private readonly usersService: UsersService,
    ) { }

    async execute(sectorId: string, context: CommuniqueEmailContext) {
        const users = await this.usersService.findAllBySector(sectorId);
        const to = users.map(user => user?.email).filter(email => !!email);
        await this.emailService.sendCommunicationEmail(to, context);
    }
}