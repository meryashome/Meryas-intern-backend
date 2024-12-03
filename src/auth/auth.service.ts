import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {PrismaService} from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,private readonly jwtService: JwtService) {}

    async validateUser(payload: any) {
        return { userId: payload.sub, role: payload.role };
    }

    async login(email: string, password: string) {
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
                avatar: user.avatar,
                jobTitle: user.jobTitle
            },
        };
    }
}
