import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { CuponService } from './cupon.service';
import { CreateCuponDto } from './dto/create-cupon.dto';
import { UpdateCuponDto } from './dto/update-cupon.dto';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';

@Controller('api/cupon')
export class CuponController {
  constructor(private readonly cuponService: CuponService) {}

  @Post()
  create(@Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  })) createCuponDto: CreateCuponDto) {
    return this.cuponService.create(createCuponDto);
  }

  @Get()
  findAll() {
    return this.cuponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.cuponService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ValidateObjectIdPipe) id: string, @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) updateCuponDto: UpdateCuponDto) {
    return this.cuponService.update(id, updateCuponDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.cuponService.remove(id);
  }
}
