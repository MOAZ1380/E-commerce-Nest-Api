import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubCategory } from './entities/subcategory.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/category/entities/category.entity';
import { SubCategoryDocument } from  './entities/subcategory.entity';
import { CategoryDocument } from 'src/category/entities/category.entity';

@Injectable()
export class SubcategoryService {
  
  constructor(
    @InjectModel(SubCategory.name) private SubCategory: Model<SubCategoryDocument>,
    @InjectModel(Category.name) private Category: Model<CategoryDocument>
  ) {}

  async create(CategoryId: string, createSubcategoryDto: CreateSubcategoryDto) {
    console.log('CategoryId', CategoryId);
    
    const category = await this.Category.findById(CategoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  
    const subcategory = await this.SubCategory.create({
      ...createSubcategoryDto,
      category: CategoryId,
    });
  
    return subcategory;
  }

  findAll(categoryId: string) {
    return `This action returns all subcategory`;
  }

  findOne(categoryId: string, id: string) {
    return `This action returns a #${id} subcategory`;
  }

  update(categoryId: string, id: string, updateSubcategoryDto: UpdateSubcategoryDto,) {
    return `This action updates a #${id} subcategory`;
  }

  remove(categoryId: string, id: string) {
    return `This action removes a #${id} subcategory`;
  }
}
