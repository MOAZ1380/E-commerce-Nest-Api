import { Type } from "class-transformer";
import { IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateReviewDto {

    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(3, { message: 'Title must be at least 3 characters' })
    @MaxLength(100, { message: 'Title must be at most 100 characters' })
    title: string;


    @IsNotEmpty({ message: 'Ratings is required' })
    @Type(() => Number)
    @Min(1, { message: 'Ratings must be at least 1' })
    @Max(5, { message: 'Ratings must be at most 5' })
    ratings: number;


}
