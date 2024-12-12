import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateFreeDayRequestDto {
    @IsString()
    startDate: string;

    @IsString()
    endDate: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
