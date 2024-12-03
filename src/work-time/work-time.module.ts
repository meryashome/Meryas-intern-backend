import { Module } from '@nestjs/common';
import { WorkTimeController } from './work-time.controller';
import { WorkTimeService } from './work-time.service';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtService} from "@nestjs/jwt";

@Module({
  imports: [PrismaModule],
  controllers: [WorkTimeController],
  providers: [WorkTimeService,JwtService]
})
export class WorkTimeModule {}
