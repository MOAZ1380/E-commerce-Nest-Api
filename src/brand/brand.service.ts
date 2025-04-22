import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './entities/brand.entity';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private BrandModel: Model<BrandDocument>) {}

  /**
   * create a new brand
   * @param createBrandDto - The data transfer object containing brand details
   * @returns The created brand
  */
  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const exists = await this.BrandModel.findOne({ name: new RegExp(`^${createBrandDto.name}$`, 'i') });
    if (exists) {
      throw new ConflictException('Brand name must be unique');
    }

    const newBrand = new this.BrandModel(createBrandDto);
    return newBrand.save();
  }

  /**
   * find all brands
   * @returns An array of brands
   */
  findAll(): Promise<Brand[]> {
    return this.BrandModel.find().exec();
  }

  /**
   * find a brand by ID
   * @param id - The ID of the brand to find
   * @returns The found brand
   */
  async findOne(id: string): Promise<Brand> {
    const brand = await this.BrandModel.findById(id);
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }

    return brand;
  }

  /**
   * update a brand by ID
   * @param id - The ID of the brand to update
   * @param updateBrandDto - The data transfer object containing updated brand details 
   * @returns The updated brand
   */
  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {

    const brand = await this.BrandModel.findById(id);
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }

    const exists = await this.BrandModel.findOne({ name: updateBrandDto.name });
    if (exists) {
      throw new ConflictException('Brand name must be unique');
    }

    const updatedBrand = await this.BrandModel.findByIdAndUpdate(id, updateBrandDto, { new: true });
    if (!updatedBrand) {
      throw new ConflictException('Brand not found');
    }

    return updatedBrand;
  }

  async remove(id: string): Promise<Brand> {
    const deletedBrand = await this.BrandModel.findByIdAndDelete(id);
    if (!deletedBrand) {
      throw new BadRequestException('Brand not found');
    }
    return deletedBrand;
  }
}
