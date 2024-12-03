import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class WorkTimeService {
    constructor(private prisma: PrismaService) {}

    // Helper to adjust a date to Tunisia time zone (UTC+1)
    private toTunisiaTime(utcDate: Date): Date {
        const date = new Date(utcDate); // Ensure the input is treated as UTC
        const offset = 1; // GMT+1 offset (no DST)
         // Add 1 hour in milliseconds
        return new Date(date.getTime() + offset * 60 * 60 * 1000);
    }
    async recordEvent(userId: number, eventType: 'start' | 'stop') {
        const now = this.toTunisiaTime(new Date());
        const startOfDay = new Date(now);

        startOfDay.setHours(0, 0, 0, 0);
        const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

        // Create a new event
        return this.prisma.workTimeEvent.create({
            data: {
                userId: numericUserId,
                eventType,
                eventTime: now,
                day: this.toTunisiaTime(startOfDay),
            },
        });
    }

    async getEventsForUser(userId: number, day: Date) {
        const startOfDay = this.toTunisiaTime(new Date(day));
        startOfDay.setHours(1, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(24, 59, 59, 999);
        const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
        // Retrieve all events for the given user and day
        return this.prisma.workTimeEvent.findMany({
            where: {
                userId: numericUserId,
                day: startOfDay,
                eventTime: {
                    gte: this.toTunisiaTime(startOfDay),
                    lte: this.toTunisiaTime(endOfDay),
                },
            },
            orderBy: { eventTime: 'asc' },
        });
    }

    async calculateWorkTime(userId: number, day: Date) {
        const events = await this.getEventsForUser(userId, day);
        let totalWorkTime = 0;
        let totalPauseTime = 0;
        let lastStartTime: Date | null = null;
        let lastStopTime: Date | null = null;

        for (const event of events) {
            const eventTime = new Date(event.eventTime);

            if (event.eventType === 'start') {
                // Calculate pause time if there's a preceding stop
                if (lastStopTime) {
                    totalPauseTime += (eventTime.getTime() - lastStopTime.getTime()) / 1000;
                }
                lastStartTime = eventTime;
                lastStopTime = null; // Reset stop time after starting
            } else if (event.eventType === 'stop' && lastStartTime) {
                totalWorkTime += (eventTime.getTime() - lastStartTime.getTime()) / 1000;
                lastStopTime = eventTime;
                lastStartTime = null; // Reset start time after stopping
            }
        }

        return {
            totalWorkTime, // in seconds
            totalPauseTime, // in seconds
        };
    }

    async getTeamTracking(managerId: number, startDate: Date, endDate: Date) {
        const startOfPeriod = this.toTunisiaTime(new Date(startDate));
        startOfPeriod.setHours(0, 0, 0, 0);

        const endOfPeriod = this.toTunisiaTime(new Date(endDate));
        endOfPeriod.setHours(23, 59, 59, 999);

        // Get team members managed by the manager
        const teamMembers = await this.prisma.user.findMany({
            where: { managerId },
            select: { id: true, name: true },
        });

        if (teamMembers.length === 0) {
            return [];
        }

        // Get all tracking events for the team members within the date range
        const trackingEvents = await this.prisma.workTimeEvent.findMany({
            where: {
                userId: { in: teamMembers.map((member) => member.id) },
                eventTime: { gte: this.toTunisiaTime(startOfPeriod), lte: this.toTunisiaTime(endOfPeriod) },
            },
            orderBy: { eventTime: 'asc' },
        });

        // Group events by date and user
        const groupedTracking = {};
        for (const event of trackingEvents) {
            const userId = event.userId;
            const eventDate = this.toTunisiaTime(event.eventTime).toISOString().split('T')[0]; // Group by date (YYYY-MM-DD)

            if (!groupedTracking[eventDate]) {
                groupedTracking[eventDate] = {};
            }
            if (!groupedTracking[eventDate][userId]) {
                const user = teamMembers.find((member) => member.id === userId);
                groupedTracking[eventDate][userId] = {
                    userName: user?.name || `User ${userId}`,
                    events: [],
                };
            }
            groupedTracking[eventDate][userId].events.push(event);
        }

        return groupedTracking;
    }

    async getAllEmployeesAndManagersTracking(startDate: Date, endDate: Date) {
        const startOfPeriod = this.toTunisiaTime(new Date(startDate));
        startOfPeriod.setHours(0, 0, 0, 0);

        const endOfPeriod = this.toTunisiaTime(new Date(endDate));
        endOfPeriod.setHours(23, 59, 59, 999);

        // Get all employees and managers
        const users = await this.prisma.user.findMany({
            where: { role: { in: ['EMPLOYEE', 'MANAGER'] } }, // Adjust roles if necessary
            select: { id: true, name: true, role: true },
        });

        // Get all tracking events for the users
        const trackingEvents = await this.prisma.workTimeEvent.findMany({
            where: {
                userId: { in: users.map((user) => user.id) },
                eventTime: { gte: this.toTunisiaTime(startOfPeriod), lte: this.toTunisiaTime(endOfPeriod) },
            },
            orderBy: { eventTime: 'asc' },
        });

        // Group events by date and user
        const groupedTracking = {};
        for (const event of trackingEvents) {
            const userId = event.userId;
            const eventDate = this.toTunisiaTime(event.eventTime).toISOString().split('T')[0];

            if (!groupedTracking[eventDate]) {
                groupedTracking[eventDate] = {};
            }
            if (!groupedTracking[eventDate][userId]) {
                const user = users.find((u) => u.id === userId);
                groupedTracking[eventDate][userId] = {
                    userName: user?.name || `User ${userId}`,
                    role: user?.role || 'Unknown',
                    events: [],
                };
            }
            groupedTracking[eventDate][userId].events.push(event);
        }

        return groupedTracking;
    }

    /**
     * Service to retrieve the last tracked event for a user on a specific day
     */
    async getLastEventForUserOnDay(userId: number, day: Date) {
        const startOfDay = this.toTunisiaTime(new Date(day));
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        // Get the last tracked event for the user on the given day
        const lastEvent = await this.prisma.workTimeEvent.findFirst({
            where: {
                userId: parseInt(String(userId)),
                eventTime: {
                    gte: this.toTunisiaTime(startOfDay),
                    lte: this.toTunisiaTime(endOfDay),
                },
            },
            orderBy: { eventTime: 'desc' },
        });

        return lastEvent || null;
    }
}
