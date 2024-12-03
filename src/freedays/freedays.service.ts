// src/freedays/freedays.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFreeDayRequestDto } from './dto/create-free-day-request.dto';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class FreeDaysService {
    constructor(private prisma: PrismaService) {}

    // Create a new free day request
    async createRequest(userId: number, createFreeDayRequestDto: CreateFreeDayRequestDto) {
        return this.prisma.freeDaysRequest.create({
            data: {
                ...createFreeDayRequestDto,
                userId,
                status: RequestStatus.PENDING,
            },
        });
    }

    // Get all free day requests for a user
    async getRequests(userId: number) {
        return this.prisma.freeDaysRequest.findMany({
            where: { userId },
        });
    }

    // Accept or decline a free day request (for managers)
    async updateRequestStatus(requestId: number, status: RequestStatus, userRole: string) {
        if (userRole !== 'MANAGER') {
            throw new UnauthorizedException('You do not have permission to update this request.');
        }

        return this.prisma.freeDaysRequest.update({
            where: { id: requestId },
            data: { status },
        });
    }
}
