import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('api/product/:productId/review')
  @UseGuards(JwtRolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  create(
  @Req() req: Request,
  @Param('productId') productId: string,
  @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  })) createReviewDto: CreateReviewDto
  ) {
    return this.reviewService.create(createReviewDto, productId , req);
  }

  @Get('api/product/:productId/review')
  findAll(@Param('productId') productId: string) {
    return this.reviewService.findAll(productId);
  }

  @Get('api/review/:id')
  findOne(
    @Param('id') id: string
  ) {
    return this.reviewService.findOne(id);
  }

  @Patch('api/review/:id')
  update(@Param('id') id: string, @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  })) updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete('api/review/:id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
