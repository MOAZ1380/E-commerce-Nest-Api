import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class CreateReviewDto {

    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(3, { message: 'Title must be at least 3 characters' })
    @MinLength(100, { message: 'Title must be at most 100 characters' })
    title: string;


    @IsNotEmpty({ message: 'Ratings is required' })
    @Min(1, { message: 'Ratings must be at least 1' })
    @Min(5, { message: 'Ratings must be at most 5' })
    @Type(() => Number)
    ratings: number;

    @IsNotEmpty({ message: 'User is required' })
    @IsMongoId({ message: 'User must be a valid MongoDB ObjectId' })
    user: string;

    @IsNotEmpty({ message: 'Product is required' })
    @IsMongoId({ message: 'Product must be a valid MongoDB ObjectId' })
    productId: string;

}
