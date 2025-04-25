import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ValidationPipe, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/utils/uploads/uploadSingleImage';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { UpdateLoggedUserDto } from './dto/updateLoggedUser.dto';


@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getMyData')
  @UseGuards(JwtRolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  getLoggedUser(@Req() req: Request) {
    return this.userService.getLoggedUserData(req);
  }


  @Patch('updateMyPassword')
  @UseGuards(JwtRolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  updateMyPassword(@Req() req: Request) {
    return this.userService.updateLoggedUserPassword(req);
  }


  @Patch('updateMe')
  @UseInterceptors(FileInterceptor('profileImg', createMulterOptions('users')))
  @UseGuards(JwtRolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  updateMe(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true,
    })) updateLoggedUserDto: UpdateLoggedUserDto,
    @Req() req: Request
  ) {
    return this.userService.updateLoggedUserData(updateLoggedUserDto, file, req);
  }

  
  @Patch('DeleteMyAccount')
  @UseGuards(JwtRolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  deleteMyAccount(@Req() req: Request) {
    return this.userService.deleteLoggedUserAccount(req);
  }
  

  @Post()
  @UseInterceptors(FileInterceptor('profileImg', createMulterOptions('users')))
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  })) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, file);
  }

  @Get()
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImg', createMulterOptions('users')))
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
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
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.userService.remove(id);
  }


  

}
