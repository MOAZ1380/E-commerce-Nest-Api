import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './entities/review.entity';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
      UserModule,
      ProductModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService, MongooseModule],
})
export class ReviewModule {}
