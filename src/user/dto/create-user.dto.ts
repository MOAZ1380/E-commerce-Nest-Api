import { Type } from "class-transformer";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail, IsOptional, ValidateNested } from "class-validator";
import { AddressDto } from "./create-address.dto";

export class CreateUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(50, { message: 'Name must be at most 50 characters' })
    name: string; 

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email is invalid' })
    email: string; 

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string; 

    @IsOptional()
    @IsString({ message: 'Profile image must be a string' })
    image?: string;

    @IsOptional()
    @IsString({ message: 'Phone number must be a string' })
    phone?: string;

    @IsOptional()
    isActive?: boolean;
    
    @IsOptional()
    @IsString({ message: 'Role must be a string' })
    role?: string;

    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
}
