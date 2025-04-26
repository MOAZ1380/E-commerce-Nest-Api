import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/category/entities/category.entity';
import { SubCategory, SubCategoryDocument } from 'src/subcategory/entities/subcategory.entity';
import { Product, ProductDocument } from './entities/product.entity';
import { Brand, BrandDocument } from 'src/brand/entities/brand.entity';

@Injectable()
export class ProductService {
  constructor(
      @InjectModel(SubCategory.name) private SubCategory: Model<SubCategoryDocument>,
      @InjectModel(Category.name) private Category: Model<CategoryDocument>,
      @InjectModel(Product.name) private Product: Model<ProductDocument>,
      @InjectModel(Brand.name) private Brand: Model<BrandDocument>
    ) {}
  
  /**
   * create a new product.
   * @param createProductDto - The data to create the product with.
   * @param imageCover - The cover image for the product.
   * @param colors - The colors for the product.
   * @returns The created product.
   */
  async create(createProductDto: CreateProductDto, imageCover: Express.Multer.File, colors: Express.Multer.File[]) {
    const { category, subcategory } = createProductDto;
    const categoryExists = await this.Category.findById(category);
    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    const subcategories = await this.SubCategory.find({ _id: { $in: subcategory } });
    if (!subcategories.length) {
      throw new BadRequestException('No valid subcategories found');
    }
    const allBelongToCategory = subcategories.every(sub => sub.category.toString() === category);
    if (!allBelongToCategory) {
      throw new BadRequestException('One or more subcategories do not belong to the selected category');
    }

    const brandExists = createProductDto.brand ? await this.Brand.findById(createProductDto.brand) : null;
    if (createProductDto.brand && !brandExists) {
      throw new BadRequestException('Brand not found');
    }

    const existingProduct = await this.Product.findOne({ title: new RegExp(`^${createProductDto.title}$`, 'i') });
    if (existingProduct) {
      throw new ConflictException('Product already exists');
    }

    if (!imageCover || !imageCover.path) {
      throw new BadRequestException('Image cover is required');
    }

    const product = await this.Product.create({
      ...createProductDto,
      imageCover: imageCover.path,
      colors: colors && colors.length > 0 ? colors.map((image) => image.path) : [],
    });

    return product;  
  }

  /**
   * Find all products.
   * @returns An array of all products.
   */
  findAll() {
    return this.Product.find()
  }
  

  /**
   * Find a product by ID.
   * @param id - The ID of the product to find.
   * @returns The found product.
   */
  async findOne(id: string) {
    const product = await this.Product.findById(id).populate('category').populate('subcategory').populate('brand');
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;    
  }

  /**
   * Update a product by ID.
   * @param id - The ID of the product to update.
   * @param updateProductDto - The data to update the product with.
   * @param imageCover - The new cover image for the product.
   * @param colors - The new colors for the product.
   * @returns The updated product.
   */
  async update(id: string, updateProductDto: UpdateProductDto, imageCover?: Express.Multer.File, colors?: Express.Multer.File[]) {      
    if (updateProductDto.category) {
      const categoryExists = await this.Category.findById(updateProductDto.category);
      if (!categoryExists) {
        throw new BadRequestException('Category not found');
      }
    }

    if (updateProductDto.subcategory) {
      const subcategories = await this.SubCategory.find({ _id: { $in: updateProductDto.subcategory } });
      if (!subcategories.length) {
        throw new BadRequestException('No valid subcategories found');
      }
      const allBelongToCategory = subcategories.every(sub => sub.category.toString() === updateProductDto.category);
      if (!allBelongToCategory) {
        throw new BadRequestException('One or more subcategories do not belong to the selected category');
      }
    }

    if (updateProductDto.brand) {
      const brandExists = await this.Brand.findById(updateProductDto.brand);
      if (!brandExists) {
        throw new BadRequestException('Brand not found');
      }
    }

    if (updateProductDto.title) {
      const existingProduct = await this.Product.findOne({ title: new RegExp(`^${updateProductDto.title}$`, 'i') });
      if (existingProduct && existingProduct._id.toString() !== id) {
        throw new ConflictException('Product with this title already exists');
      }
    }

    if (imageCover) {
      if (!imageCover.path) {
        throw new BadRequestException('Image cover is required');
      }
      updateProductDto.imageCover = imageCover.path;
    }
    if (colors && colors.length > 0) {
      updateProductDto.colors = colors.map((image) => image.path);
    }

    const product = await this.Product.findByIdAndUpdate(id, updateProductDto, { new: true });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }

  /**
   * Remove a product by ID.
   * @param id - The ID of the product to remove.
   * @returns The removed product.
   */
  async remove(id: string) {
    const product = await this.Product.findById(id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return this.Product.findByIdAndDelete(id);
  }
}
