import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SectorsModule } from './modules/sectors/sectors.module';
import { UsersModule } from './modules/users/users.module';
import { VisitHistoryModule } from './modules/visit-history/visit-history.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { MeetingModule } from './modules/meeting/meeting.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { CronjobsModule } from './modules/cronjobs/cronjobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommuniqueModule } from './modules/communique/communique.module';

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
