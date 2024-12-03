import {forwardRef, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import {AuthController} from "./auth.controller";
import {UserModule} from "../user/user.module";
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'Scamed_lejmi',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService,JwtModule],
  controllers: [AuthController]
})
export class AuthModule {}
