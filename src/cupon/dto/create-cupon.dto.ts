import { IsString, IsNotEmpty, IsDate, IsNumber, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class CreateCuponDto {
    @IsString({ message: 'Code must be a string' })
    @IsNotEmpty({ message: 'Code is required' })
    code: string;

    @Type(() => Date)
    @IsDate({ message: 'Expire must be a valid date' })
    @IsNotEmpty({ message: 'Expire date is required' })
    expire: Date;

    @Type(() => Number)
    @IsNumber({}, { message: 'Discount must be a number' })
    @IsNotEmpty({ message: 'Discount is required' })
    @Min(1, { message: 'Discount must be at least 1' })
    @Max(100, { message: 'Discount must be at most 100' })
    discount: number;
}
