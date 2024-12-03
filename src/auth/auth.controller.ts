import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {SignInDto} from "../user/DTO/SignInDto";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authServices: AuthService) {}

    @Post('sign-in')
    async signIn(@Body() signInDto: SignInDto) {
        return this.authServices.login(signInDto.email, signInDto.password);
    }
}
