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
        const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
        return this.prisma.freeDaysRequest.create({
            data: {
                ...createFreeDayRequestDto,
                userId: numericUserId,
                status: RequestStatus.PENDING,
            },
        });
    }

    // Get all free day requests for a user
    async getRequests() {
        return this.prisma.freeDaysRequest.findMany({
            where: { status : 'PENDING' },
        });
    }

    // Accept or decline a free day request (for managers)
    async updateRequestStatus(requestId: number, status: RequestStatus) {
        const numericRequestId = typeof requestId === 'string' ? parseInt(requestId, 10) : requestId;
        return this.prisma.freeDaysRequest.update({
            where: { id: numericRequestId },
            data: { status },
        });
    }
}
