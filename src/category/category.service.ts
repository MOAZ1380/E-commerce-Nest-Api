import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';
import { CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  /**
   * Create a new category
   * @param createCategoryDto - The data transfer object containing category details
   * @returns The created category
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const exists = await this.categoryModel.findOne({ name: createCategoryDto.name });
    if (exists) {
      throw new BadRequestException('Category name must be unique');
    }

    createCategoryDto.slug = createCategoryDto.name.toLowerCase().replace(/\s/g, '-');
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }


  /**
   * Find all categories
   * @returns An array of categories
   */
  async findAll(): Promise<Category[]> {    
    return this.categoryModel.find().exec();
  }

  /**
   * Find a category by ID
   * @param id - The ID of the category to find
   * @returns The found category
   */
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return category;
  }

  /**
   * Update a category by ID
   * @param id - The ID of the category to update
   * @param updateCategoryDto - The data transfer object containing updated category details 
   * @returns The updated category
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {

    if (updateCategoryDto.name) {
      updateCategoryDto.slug = updateCategoryDto.name.toLowerCase().replace(/\s/g, '-');
    }

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
    if (!updatedCategory) {
      throw new BadRequestException('Category not found');
    }
    return updatedCategory;
  }

  /**
   * Delete a category by ID
   * @param id - The ID of the category to delete
   * @returns The deleted category
   */
  async remove(id: string): Promise<Category> {
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!deletedCategory) {
      throw new BadRequestException('Category not found');
    }
    return deletedCategory;
  }
}
