import {
    Controller,
    Get,
    Param,
    Patch,
    Body,
    Post,
    Delete,
    ForbiddenException, UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import {JwtAuthGuard} from "../auth/auth/auth.guard";
import {CreateUserDto} from "./DTO/CreateUserDto";

@Controller('/user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
    @Get('managers')
    async getAllManagers() {
        return this.userService.getAllManagers();
    }
    @Get('todayBirthDay')
    async getAllTodayBirthDay() {
        return this.userService.getAllTodayBirthDay();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(+id);
    }

    @Patch(':id/password')
    async updatePassword(
        @Param('id') id: string,
        @Body('password') password: string,
    ) {
        return this.userService.updatePassword(+id, password);
    }

    // Admin: Create a new user
    @Post('add')
    async createUser(
        @Body() userData: CreateUserDto,
    ) {
        return this.userService.createUser(userData);
    }

    // Admin: Delete a user
    @Delete(':adminId/:userId')
    async deleteUser(
        @Param('adminId') adminId: string,
        @Param('userId') userId: string,
    ) {
        return this.userService.deleteUser(+adminId, +userId);
    }

    // User: Sign-In
    @Post('sign-in')
    async signIn(
        @Body() credentials: { email: string; password: string },
    ) {
        return this.userService.signIn(credentials.email, credentials.password);
    }
}
