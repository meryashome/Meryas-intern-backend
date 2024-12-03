import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { WorkTimeModule } from './work-time/work-time.module';
import { AuthModule } from './auth/auth.module';
import {PrismaService} from "./prisma/prisma.service";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth/auth.controller";
import { HelpdeskModule } from './helpdesk/helpdesk.module';
import { FreeDaysController } from './freedays/freedays.controller';
import { FreeDaysService } from './freedays/freedays.service';
import { FreedaysModule } from './freedays/freedays.module';
import {ScheduleModule} from "@nestjs/schedule";

@Module({
  imports: [PrismaModule, UserModule, WorkTimeModule, AuthModule,
    HelpdeskModule,
    FreedaysModule,
    ScheduleModule.forRoot()],
  controllers: [AppController,AuthController, FreeDaysController],
  providers: [AppService, FreeDaysService],
})
export class AppModule {}
