import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(50, { message: 'Name must be at most 50 characters' })
    name: string; 

    @IsString({ message: 'Slug must be a string' })
    @IsOptional()
    slug: string; 

    @IsString({ message: 'Image must be a string' })
    @IsOptional()
    image: string;
}
