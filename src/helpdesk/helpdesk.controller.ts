// src/helpdesk/helpdesk.controller.ts
import { Controller, Post, Get, Body, Param, Put, Req } from '@nestjs/common';
import { HelpdeskService } from './helpdesk.service';
import { CreateHelpdeskRequestDto } from './dto/create-helpdesk-request.dto';
import { RequestStatus } from '@prisma/client';

@Controller('helpdesk')
export class HelpdeskController {
    constructor(private helpdeskService: HelpdeskService) {}

    // Endpoint to create a new helpdesk request
    @Post('create/:userId')
    async createRequest(
        @Body() createHelpdeskRequestDto: CreateHelpdeskRequestDto,
        @Param('userId') userId: number,    ) {
        return this.helpdeskService.createRequest(userId, createHelpdeskRequestDto);
    }

    // Endpoint to get helpdesk requests based on the user's role
    @Get('requests')
    async getRequests(@Req() req: any) {
        const userId = req.user.id;
        const userRole = req.user.role; // Assuming role is in the user info

        return this.helpdeskService.getRequests(userId, userRole);
    }

    // Endpoint to update the status of a helpdesk request
    @Put('update-status/:requestId')
    async updateRequestStatus(
        @Param('requestId') requestId: number,
        @Body('status') status: RequestStatus,
        @Req() req: any,
    ) {
        const userRole = req.user.role; // Assuming role is in the user info
        return this.helpdeskService.updateRequestStatus(requestId, status, userRole);
    }
}
