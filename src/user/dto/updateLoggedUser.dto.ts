import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail, IsOptional } from "class-validator";

export class UpdateLoggedUserDto {

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(50, { message: 'Name must be at most 50 characters' })
    name: string; 

    @IsOptional()
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email is invalid' })
    email?: string; 
 

    @IsOptional()
    @IsString({ message: 'Profile image must be a string' })
    image?: string;

    @IsOptional()
    @IsString({ message: 'Phone number must be a string' })
    phone?: string;

}
