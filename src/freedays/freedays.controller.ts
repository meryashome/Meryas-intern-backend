// src/freedays/freedays.controller.ts
import { Controller, Post, Get, Body, Param, Put } from '@nestjs/common';
import { FreeDaysService } from './freedays.service';
import { CreateFreeDayRequestDto } from './dto/create-free-day-request.dto';
import { RequestStatus } from '@prisma/client';

@Controller('freedays')
export class FreeDaysController {
    constructor(private freeDaysService: FreeDaysService) {}

    // Endpoint to create a new free day request
    @Post('create')
    async createRequest(
        @Body() createFreeDayRequestDto: CreateFreeDayRequestDto,
        @Param('userId') userId: number,
    ) {
        return this.freeDaysService.createRequest(userId, createFreeDayRequestDto);
    }

    // Endpoint to get all free day requests for a user
    @Get('requests/:userId')
    async getRequests(@Param('userId') userId: number) {
        return this.freeDaysService.getRequests(userId);
    }

    // Endpoint to update the status of a free day request
    @Put('update-status/:requestId')
    async updateRequestStatus(
        @Param('requestId') requestId: number,
        @Body('status') status: RequestStatus,
        @Param('role') role: string,
    ) {
        return this.freeDaysService.updateRequestStatus(requestId, status, role);
    }
}
