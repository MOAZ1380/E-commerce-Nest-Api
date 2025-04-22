import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * Create a new subcategory
   * @param CategoryId - The ID of the category to which the subcategory belongs
   * @param createSubcategoryDto - The data transfer object containing subcategory details
   * @return The created subcategory
   */
  async create(CategoryId: string, createSubcategoryDto: CreateSubcategoryDto): Promise<SubCategory> {    
    const category = await this.Category.findById(CategoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const existingSubcategory = await this.SubCategory.findOne({ name: createSubcategoryDto.name});
    if (existingSubcategory) {
      throw new NotFoundException('Subcategory already exists in this category');
    }
    
    createSubcategoryDto.slug  = createSubcategoryDto.name.toLowerCase().replace(/\s/g, '-');
    const subcategory: SubCategory = await this.SubCategory.create({
      ...createSubcategoryDto,
      category: CategoryId,
    });
  
    return subcategory;
  }

  /**
   * Find all subcategories for a given category
   * @param categoryId - The ID of the category
   * @return An array of subcategories
  */
  findAll(categoryId: string): Promise<SubCategory[]> {
    return this.SubCategory.find({ category: categoryId }).exec();
  }


  /**
   * Find a subcategory by ID within a given category
   * @param categoryId - The ID of the category
   * @param id - The ID of the subcategor
   * @return The found subcategory
  */
  async findOne(categoryId: string, id: string): Promise<SubCategory> {
    const category = await this.Category.findById(categoryId).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const subcategory = await this.SubCategory.findById(id).exec();
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    if (subcategory.category.toString() !== categoryId) {
      throw new NotFoundException('Subcategory does not belong to this category');
    }
    return subcategory;
  }

  /**
   * Update a subcategory by ID within a given category
   * @param categoryId - The ID of the category
   * @param id - The ID of the subcategory to update
   * @param updateSubcategoryDto - The data transfer object containing updated subcategory details
   * @return The updated subcategory
  */
  async update(categoryId: string, id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<SubCategory> {
    const category = await this.Category.findById(categoryId).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const subcategory = await this.SubCategory.findById(id).exec();
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    if (subcategory.category.toString() !== categoryId) {
      throw new NotFoundException('Subcategory does not belong to this category');
    }
    if (updateSubcategoryDto.name) {
      const existingSubcategory = await this.SubCategory.findOne({ name: updateSubcategoryDto.name, category: categoryId });
      if (existingSubcategory && existingSubcategory.id !== id) {
        throw new ConflictException('Subcategory already exists in this category');
      }
    }

    const updatedSubcategory = await this.SubCategory.findByIdAndUpdate(id, updateSubcategoryDto, { new: true }).exec();
    if (!updatedSubcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return updatedSubcategory;
  }


  /**
   * Delete a subcategory by ID within a given category
   * @param categoryId - The ID of the category
   * @param id - The ID of the subcategory to delete
   * @return A message indicating successful deletion
  */
  async remove(categoryId: string, id: string) {
    const subcategory = await this.SubCategory.findOneAndDelete({ _id: id, category: categoryId }).exec();
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return { "message": "deleted successfully" };
  }
}
