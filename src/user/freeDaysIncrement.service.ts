import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service'; // Adjust the path as needed

@Injectable()
export class FreeDaysIncrementService {
    private readonly logger = new Logger(FreeDaysIncrementService.name);

    constructor(private readonly prisma: PrismaService) {}

    @Cron('0 0 1 * *') // Runs at midnight on the first day of every month
    async incrementFreeDays() {
        try {
            this.logger.log('Starting free days increment task...');

            const updatedUsers = await this.prisma.user.updateMany({
                where: {
                    OR: [
                        { role: 'EMPLOYEE' }, // Include Employees
                        { role: 'MANAGER' },  // Include Managers
                    ],
                },
                data: { freeDays: { increment: 2 } }, // Increment free days by 2
            });

            this.logger.log(`Successfully updated free days for ${updatedUsers.count} users.`);
        } catch (error) {
            this.logger.error('Failed to increment free days', error.stack);
        }
    }
}
