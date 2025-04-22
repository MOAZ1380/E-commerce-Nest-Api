import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateBrandDto {
    save() {
      throw new Error('Method not implemented.');
    }
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(50, { message: 'Name must be at most 50 characters' })
    name: string; 

    slug?: string; 

    image?: string;
}
