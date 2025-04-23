import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads/categories');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = 'Category.' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
        cb(null, uniqueSuffix);
      }
    }),
    fileFilter: (req: any, file: { mimetype: string; }, cb: (arg0: Error | null, arg1: boolean) => void) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
        cb(new Error('Only image files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5
    }
  }))
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
  @UseInterceptors(
    FileInterceptor('image', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads/categories');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = 'Category.' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
        cb(null, uniqueSuffix);
      }
    }),
    fileFilter: (req: any, file: { mimetype: string; }, cb: (arg0: Error | null, arg1: boolean) => void) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
        cb(new Error('Only image files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5
    }
  }))
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
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
