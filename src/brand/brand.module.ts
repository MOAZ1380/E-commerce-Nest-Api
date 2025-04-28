import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand, BrandSchema } from './entities/brand.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
          { name: Brand.name, schema: BrandSchema },
      ])
  ],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService, MongooseModule]
})
export class BrandModule {}
