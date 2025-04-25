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

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
