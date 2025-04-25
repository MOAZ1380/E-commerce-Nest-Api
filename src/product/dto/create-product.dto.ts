import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsArray, IsMongoId, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  sold?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  priceAfterDiscount?: number;

  @IsMongoId()
  category: string;

  @IsArray()
  @IsMongoId({ each: true })
  subcategory: string[];

  @IsMongoId()
  @IsOptional()
  brand?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  ratingsAverage?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  ratingsQuantity?: number;
}
