import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';
import { ProductService } from 'src/product/product.service';
import { ValidateObjectIdPipe } from 'src/utils/pipes/validate-object-id.pipe';

@Controller('api/wishlist')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly productService: ProductService
  ) {}

  @Post()
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin, Role.User, Role.Manager)
  create(@Body('product') product: string, @Req() req: Request) {
    return this.wishlistService.create(product, req);
  }

  @Get()
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin, Role.User, Role.Manager)
  findAll(@Req() req: Request) {
    return this.wishlistService.findAll(req);
  }

  @Get(':productId')
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin, Role.User, Role.Manager)
  findOne(@Param('productId', ValidateObjectIdPipe) productId: string) {
    return this.productService.findOne(productId);
  }


  @Delete(':productId')
  @UseGuards(JwtRolesGuard)
  @Roles(Role.Admin, Role.User, Role.Manager)
  remove(@Param('productId', ValidateObjectIdPipe) productId: string, @Req() req: Request) {
    return this.wishlistService.remove(productId, req);
  }
}
