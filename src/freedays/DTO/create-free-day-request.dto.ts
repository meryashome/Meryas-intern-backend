import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateFreeDayRequestDto {
    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
