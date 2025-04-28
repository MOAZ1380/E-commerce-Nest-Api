import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ValidationPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';

@Controller('api/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(JwtRolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  create(@Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) createAddressDto: CreateAddressDto, @Req() req: Request) {
    return this.addressService.create(createAddressDto, req);
  }

  @Get()
  @UseGuards(JwtRolesGuard)
  findAll(@Req() req: Request) {
    return this.addressService.findAll(req);
  }

  @Get(':id')
  @UseGuards(JwtRolesGuard)
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtRolesGuard)
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @UseGuards(JwtRolesGuard)
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
