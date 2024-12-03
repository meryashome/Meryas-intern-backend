import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { WorkTimeService } from './work-time.service';

@Controller('work-time')
export class WorkTimeController {
    constructor(private readonly workTimeService: WorkTimeService) {}

    @Post(':userId/event')
    async recordEvent(
        @Param('userId') userId: number,
        @Body('eventType') eventType: 'start' | 'stop',
    ) {
        return this.workTimeService.recordEvent(userId, eventType);
    }

    @Get(':userId/events')
    async getEvents(
        @Param('userId') userId: number,
        @Query('day') day: string,
    ) {
        const date = new Date(day);
        return this.workTimeService.getEventsForUser(userId, date);
    }

    @Get(':userId/summary')
    async getSummary(
        @Param('userId') userId: number,
        @Query('day') day: string,
    ) {
        const date = new Date(day);
        return this.workTimeService.calculateWorkTime(userId, date);
    }

    /**
     * Get tracking times for all employees and managers, grouped by date
     */
    @Get('all-tracking')
    async getAllEmployeesAndManagersTracking(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.workTimeService.getAllEmployeesAndManagersTracking(start, end);
    }

    /**
     * Get the last event tracked for a user on a specific day
     */
    @Get(':userId/last-event')
    async getLastEventForUserOnDay(
        @Param('userId') userId: number,
        @Query('day') day: string,
    ) {
        const date = new Date(day);
        return this.workTimeService.getLastEventForUserOnDay(userId, date);
    }

    /**
     * Get tracking times for all team members under a manager, grouped by date
     */
    @Get(':managerId/team-tracking')
    async getTeamTracking(
        @Param('managerId') managerId: number,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.workTimeService.getTeamTracking(managerId, start, end);
    }
}
