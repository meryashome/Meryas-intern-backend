// src/user/user.module.ts
import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
import { JwtService } from '@nestjs/jwt';
import {UserController} from "./user.controller";
import {AuthModule} from "../auth/auth.module";
import {FreeDaysIncrementService} from "./freeDaysIncrement.service"; // For JwtService

@Module({
  imports: [PrismaModule],  // Add PrismaModule here
  providers: [FreeDaysIncrementService,UserService, JwtService],
  exports: [UserService], // Export if needed
  controllers: [UserController],
})
export class UserModule {}
