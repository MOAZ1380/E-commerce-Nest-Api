import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ValidationPipe, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/utils/uploads/uploadSingleImage';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profileImg', createMulterOptions('users')))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  })) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, file);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImg', createMulterOptions('users')))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ValidateObjectIdPipe) id: string, @Body(new ValidationPipe({
      whitelist: true,
      transform: true,
    })) updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
