import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { envConfig } from "src/config/config";
import { EmailService } from "./application/services/email.service";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: envConfig.MAIL_HOST,
        port: Number(envConfig.MAIL_PORT),
        // 465 = true | 587 = false
        secure: true,
        auth: {
          user: envConfig.MAIL_USER,
          pass: envConfig.MAIL_PASS,
        },
      },
      defaults: {
        from: envConfig.MAIL_FROM,
      },
      template: {
        dir: "src/modules/email/templates",
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
