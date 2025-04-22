import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './entities/brand.entity';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private BrandModel: Model<BrandDocument>) {}

  async create(createBrandDto: CreateBrandDto) {
    const exists = await this.BrandModel.findOne({ name: createBrandDto.name });
    if (exists) {
      throw new ConflictException('Brand name must be unique');
    }

    const newBrand: CreateBrandDto = new this.BrandModel(createBrandDto);
    return newBrand.save();
  }

  findAll() {
    return this.BrandModel.find().exec();
  }

  async findOne(id: string) {
    const brand = await this.BrandModel.findById(id);
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {

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

  async remove(id: string) {
    const deletedBrand = await this.BrandModel.findByIdAndDelete(id);
    if (!deletedBrand) {
      throw new BadRequestException('Brand not found');
    }
    return deletedBrand;
  }
}
