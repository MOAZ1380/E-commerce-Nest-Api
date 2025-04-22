import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';
import { SubCategory, SubCategorySchema } from 'src/subcategory/entities/subcategory.entity';


@Module({
  imports: [
    forwardRef(() => SubcategoryModule),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService, MongooseModule]
})
export class CategoryModule {}
