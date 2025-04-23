import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';
import { CategoryDocument } from './entities/category.entity';
import { SubCategory, SubCategoryDocument } from 'src/subcategory/entities/subcategory.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(SubCategory.name) private SubCategory: Model<SubCategoryDocument>
  ) {}

  /**
   * Create a new category
   * @param createCategoryDto - The data transfer object containing category details
   * @returns The created category
   */
  async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File): Promise<Category> {
    const exists = await this.categoryModel.findOne({ name: new RegExp(`^${createCategoryDto.name}$`, 'i') });
    if (exists) {
      throw new BadRequestException('Category name must be unique');
    }
    const imagePath = file?.path;
    
    const newCategory = new this.categoryModel({
      ...createCategoryDto,
      image : imagePath
    });
    
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
  async update(id: string, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File): Promise<Category> {
    const exists = await this.categoryModel.findOne({ name: new RegExp(`^${updateCategoryDto.name}$`, 'i') });
    if (exists) {
      throw new ConflictException('Category name must be unique');
    }

    const imagePath = file?.path;

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id,
       { 
        ...updateCategoryDto,
        image : imagePath
       },
      { new: true }).exec();
      
    if (!updatedCategory) {
      throw new BadRequestException('Category not found');
    }
    return updatedCategory.save();
  }

  /**
   * Delete a category by ID
   * @param id - The ID of the category to delete
   * @returns The deleted category
   */
  async remove(id: string): Promise<{ message: string; data: Category }> {
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!deletedCategory) {
      throw new BadRequestException('Category not found');
    }

    const subcategories = await this.SubCategory.deleteMany({ category: id }).exec();
    if (subcategories.deletedCount > 0) {
      console.log(`Deleted ${subcategories.deletedCount} subcategories associated with category ID ${id}`);
    } else {
      console.log(`No subcategories found for category ID ${id}`);
    }

    return {"message": "Category deleted successfully and subcategory", "data": Category };
  }
}
