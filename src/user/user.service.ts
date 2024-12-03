import {Injectable, ForbiddenException, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async getAllUsers() {
        return this.prisma.user.findMany();
    }

    async getAllManagers() {
        return this.prisma.user.findMany({where: {role: 'MANAGER'}});
    }

    async getUserById(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async updatePassword(id: number, newPassword: string) {
        return this.prisma.user.update({
            where: { id },
            data: { password: newPassword },
        });
    }

    // Admin: Create a new user
    async createUser(userData: Prisma.UserCreateInput) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        return this.prisma.user.create({
            data: { ...userData, password: hashedPassword },
        });
    }

    // Admin: Delete a user
    async deleteUser(adminId: number, userId: number) {
        const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
        if (admin?.role !== Role.ADMIN) {
            throw new ForbiddenException('Only admins can delete users');
        }

        return this.prisma.user.delete({ where: { id: userId } });
    }

    // User Sign-In
    async signIn(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials user');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials pwd');
        }

        const payload = { userId: user.id, role: user.role };
        const token = this.jwtService.sign(payload);

        return {
            token,
            role: user.role,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}
