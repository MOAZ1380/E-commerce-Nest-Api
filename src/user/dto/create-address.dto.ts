import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsBoolean } from "class-validator";

export class AddressDto {
    @IsNotEmpty({ message: 'Street is required' })
    @IsString({ message: 'Street must be a string' })
    @MinLength(3, { message: 'Street must be at least 3 characters' })
    @MaxLength(50, { message: 'Street must be at most 50 characters' })
    street: string;

    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    @MinLength(3, { message: 'City must be at least 3 characters' })
    @MaxLength(50, { message: 'City must be at most 50 characters' })
    city: string;

    @IsNotEmpty({ message: 'State is required' })
    @IsString({ message: 'State must be a string' })
    @MinLength(3, { message: 'State must be at least 3 characters' })
    @MaxLength(50, { message: 'State must be at most 50 characters' })
    state: string;

    @IsNotEmpty({ message: 'Country is required' })
    @IsString({ message: 'Country must be a string' })
    @MinLength(3, { message: 'Country must be at least 3 characters' })
    @MaxLength(50, { message: 'Country must be at most 50 characters' })
    country: string;

    @IsNotEmpty({ message: 'Zip code is required' })
    @IsString({ message: 'Zip code must be a string' })
    @MinLength(5, { message: 'Zip code must be at least 5 characters' })
    @MaxLength(10, { message: 'Zip code must be at most 10 characters' })
    zipCode: string;

    @IsOptional()
    @IsBoolean({ message: 'Main address must be a boolean value' })
    mainAddress?: boolean;
}