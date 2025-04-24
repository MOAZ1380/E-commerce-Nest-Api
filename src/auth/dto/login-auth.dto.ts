import { IsNotEmpty, IsString, MinLength, IsEmail } from "class-validator";

export class LoginAuthDto {

    @IsNotEmpty({ message: 'Name is required' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email is invalid' })
    email: string; 

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string; 
}
