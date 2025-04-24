import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/utils/uploads/uploadSingleImage';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';

@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', createMulterOptions('categories')))
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true, 
    })) createCategoryDto: CreateCategoryDto
  ) {
    return this.categoryService.create(createCategoryDto, file);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', createMulterOptions('categories')))
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
