import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';

@Controller('api/categories/:CategoryId/subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createSubcategoryDto: CreateSubcategoryDto,
    @Param('CategoryId', ValidateObjectIdPipe) CategoryId: string
    ) {
    return this.subcategoryService.create(CategoryId, createSubcategoryDto);
  }

  @Get()
  findAll(
    @Param('CategoryId', ValidateObjectIdPipe) categoryId: string
  ) {
    return this.subcategoryService.findAll(categoryId);
  }

  @Get(':id')
  findOne(
    @Param('CategoryId', ValidateObjectIdPipe) categoryId: string,
    @Param('id', ValidateObjectIdPipe) id: string
  ) {
    return this.subcategoryService.findOne(categoryId, id);
  }

  @Patch(':id')
  update(
    @Param('CategoryId', ValidateObjectIdPipe) categoryId: string,
    @Param('id', ValidateObjectIdPipe) id: string, @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoryService.update(categoryId, id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(
    @Param('CategoryId', ValidateObjectIdPipe) categoryId: string,
    @Param('id', ValidateObjectIdPipe) id: string
  ) {
    return this.subcategoryService.remove(categoryId, id);
  }
}
