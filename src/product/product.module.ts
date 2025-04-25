import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from 'src/category/category.module';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';
import { Product, ProductSchema } from './entities/product.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [
    CategoryModule,
    SubcategoryModule,
    BrandModule,
    MongooseModule.forFeature([
        { name: Product.name, schema: ProductSchema },
      ])
    ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
