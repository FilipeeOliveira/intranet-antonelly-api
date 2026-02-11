import { Injectable, Logger } from "@nestjs/common";
import { CommuniqueEmailContext, EmailService } from "src/modules/email/application/services/email.service";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class SendEmailCommuniqueBySector {
    constructor(
        private readonly emailService: EmailService,
        private readonly prisma: PrismaService,
    ) { }

    private readonly logger = new Logger(SendEmailCommuniqueBySector.name);

    async execute(_sectorId: string, context: CommuniqueEmailContext) {
        const users = await this.prisma.user.findMany({
            where: { isActive: true },
            select: { email: true },
        });

        if (users.length === 0) {
            this.logger.warn('Nenhum usuário ativo encontrado. Email não enviado.');
            return;
        }

        const to = users.map(user => user.email);
        this.logger.log(`Enviando comunicado para ${to.length} usuários ativos`);
        this.emailService.sendCommunicationEmail(to, context);
    }
}
