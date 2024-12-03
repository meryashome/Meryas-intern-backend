import { Role } from '@prisma/client';
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    nationalId: string;

    @IsString()
    name: string;

    @IsString()
    familyName: string;

    @IsString()
    birthDate: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsString()
    jobTitle: string;

    @IsEnum(Role)
    role: Role;

    @IsString()
    jobStartDate: string;

    @IsOptional()
    @IsInt()
    managerId?: number;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsInt()
    @Min(0)
    freeDays: number;

    @IsOptional()
    @IsInt()
    extraDays?: number;

    @IsOptional()
    @IsString()
    cityOrTown?: string;

    @IsOptional()
    @IsString()
    country?: string;
}
