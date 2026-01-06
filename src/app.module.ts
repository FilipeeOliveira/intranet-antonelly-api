import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { CommuniqueModule } from './modules/communique/communique.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { CronjobsModule } from './modules/cronjobs/cronjobs.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { MeetingModule } from './modules/meeting/meeting.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SectorsModule } from './modules/sectors/sectors.module';
import { UsersModule } from './modules/users/users.module';
import { VisitHistoryModule } from './modules/visit-history/visit-history.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 5, // 5 tentativas por minuto
    }]),
    AuthModule,
    CronjobsModule,
    CompaniesModule,
    CommuniqueModule,
    DocumentsModule,
    UsersModule,
    PrismaModule,
    PermissionsModule,
    SectorsModule,
    VisitHistoryModule,
    MeetingModule,
    RoomsModule,
    NotificationModule,
    RolesModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule { }
