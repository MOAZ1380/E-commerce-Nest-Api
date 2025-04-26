import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';

@Controller('api/review/product/:productId/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtRolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  create(
  @Req() req: Request,
  @Param('productId') productId: string,
  @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewService.create({ ...createReviewDto, productId }, req);
  }

  @Get()
  findAll(@Param('productId') productId: string) {
    return this.reviewService.findAll(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
