// src/helpdesk/dto/create-helpdesk-request.dto.ts
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { HelpdeskType } from '@prisma/client';

export class CreateHelpdeskRequestDto {
    @IsEnum(HelpdeskType)
    type: HelpdeskType;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
