import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';


@Controller('api/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  create(
    @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  })) createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ValidateObjectIdPipe) id: string, @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.brandService.remove(id);
  }
}
