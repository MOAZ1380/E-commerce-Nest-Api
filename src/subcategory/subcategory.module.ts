import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { SubCategory, SubCategorySchema } from './entities/subcategory.entity';
import { CategoryModule } from 'src/category/category.module';
import { Category, CategorySchema } from 'src/category/entities/category.entity';

@Module({
  imports: [
    forwardRef(() => CategoryModule),
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService, MongooseModule],
})
export class SubcategoryModule {}
