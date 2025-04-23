import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('api/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(
      FileInterceptor('image', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads/brands');
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = 'brands.' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
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
    }
  ))
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
  @UseInterceptors(
    FileInterceptor('image', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads/brands');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = 'brands.' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
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
    }
  ))
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
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.brandService.remove(id);
  }
}
