// src/helpdesk/helpdesk.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHelpdeskRequestDto } from './dto/create-helpdesk-request.dto';
import { HelpdeskType, RequestStatus } from '@prisma/client';

@Injectable()
export class HelpdeskService {
    constructor(private prisma: PrismaService) {}

    // Create a new helpdesk request
    async createRequest(
        userId: number,
        createHelpdeskRequestDto: CreateHelpdeskRequestDto,
    ) {
        const { type, category, description } = createHelpdeskRequestDto;
        const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
        return this.prisma.helpdeskRequest.create({
            data: {
                type,
                category,
                description,
                userId: numericUserId,
                status: RequestStatus.PENDING,
            },
        });
    }

    // Get helpdesk requests for a specific user based on role
    async getRequests(userId: number, userRole: string) {
        if (userRole === 'IT') {
            // IT users can view all requests
            return this.prisma.helpdeskRequest.findMany({
                where: { type: HelpdeskType.IT },
            });
        }

        if (userRole === 'HR') {
            // HR users can only view HR requests
            return this.prisma.helpdeskRequest.findMany({
                where: { type: HelpdeskType.HR },
            });
        }

        // Non-IT/HR users can only view their own requests
        return this.prisma.helpdeskRequest.findMany({
            where: { userId },
        });
    }

    // Update the status of a helpdesk request (can only be done by IT or HR users)
    async updateRequestStatus(
        requestId: number,
        status: RequestStatus,
        userRole: string,
    ) {
        // Only IT or HR users can update the status of a request
        if (userRole !== 'IT' && userRole !== 'HR') {
            throw new UnauthorizedException('You do not have permission to update this request.');
        }

        return this.prisma.helpdeskRequest.update({
            where: { id: requestId },
            data: { status },
        });
    }
}
