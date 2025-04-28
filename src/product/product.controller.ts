import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/utils/uploads/uploadSingleImage';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post() // error in uploading images
  @UseInterceptors(FilesInterceptor('images', 10, createMulterOptions('products')))
  create(
      @UploadedFiles() images: Express.Multer.File[],
      @Body(new ValidationPipe({ whitelist: true, transform: true })) createProductDto: CreateProductDto
  ) {
    
    const imageCover = images[0];
    const colors = images.slice(1);
    return this.productService.create(createProductDto, imageCover, colors);
  }


  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id') // error in uploading images
  @UseInterceptors(FilesInterceptor('images', 10, createMulterOptions('products')))
  update(
    @UploadedFiles() images: Express.Multer.File[],
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true,})) updateProductDto: UpdateProductDto
  ) {
    let imageCover: Express.Multer.File | undefined;
    let colors: Express.Multer.File[] = [];

    if (images && images.length > 0) {
      imageCover = images[0];  
      colors = images.slice(1); 
    }
    return this.productService.update(id, updateProductDto, imageCover, colors);
  }

  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.productService.remove(id)
  }
}
