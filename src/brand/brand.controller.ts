import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from '../utils/uploads/uploadSingleImage';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';

@Controller('api/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', createMulterOptions('brands')))
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  })) createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto, file);
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
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image', createMulterOptions('brands')))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true,
    })) updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.brandService.remove(id);
  }
}
