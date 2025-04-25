import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/utils/uploads/uploadSingleImage';
import { log } from 'console';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, createMulterOptions('products')))
  create(
      @UploadedFiles() images: Express.Multer.File[],
      @Body(new ValidationPipe({ whitelist: true, transform: true })) createProductDto: CreateProductDto,
  ) {
    
    const imageCover = images[0]; // The first image is the cover image
    const colors = images.slice(1); // The rest are color images
    return this.productService.create(createProductDto, imageCover, colors);
  }


  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
