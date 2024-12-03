import { Module } from '@nestjs/common';
import {PrismaModule} from "../prisma/prisma.module";
import {FreeDaysService} from "./freedays.service";
import {FreeDaysController} from "./freedays.controller";

@Module({
    imports: [PrismaModule],
    providers: [FreeDaysService],
    controllers: [FreeDaysController]
})
export class FreedaysModule {}
