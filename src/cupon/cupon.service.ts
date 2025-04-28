import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateCuponDto } from './dto/create-cupon.dto';
import { UpdateCuponDto } from './dto/update-cupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cupon } from './entities/cupon.entity';
import { Model } from 'mongoose';

@Injectable()
export class CuponService {
  constructor(
    @InjectModel(Cupon.name) private cuponModel: Model<Cupon>,
  ) {}

  /**
   * create a new cupon
   * @param createCuponDto  
   * @returns 
   */
  async create(createCuponDto: CreateCuponDto) {
    const existcupon = await this.cuponModel.findOne({ code: createCuponDto.code });
    if (existcupon) {
      throw new ConflictException('Cupon already exists');
    }

    if (createCuponDto.expire < new Date()) {
      throw new ConflictException('Cupon expired date must be greater than current date');
    }

    const newCupon = new this.cuponModel(createCuponDto);
    return newCupon.save();
  }


  /**
   * find all cupons
   * @returns 
   */
  findAll() {
    return this.cuponModel.find().exec();
  }

  
  /**
   * find cupon by id
   * @param id 
   * @returns 
   */
  async findOne(id: string) {
    const cupon = await this.cuponModel.findById(id).exec();
    if (!cupon) {
      throw new BadRequestException('Cupon not found');
    }

    return cupon;
  }


  /**
   * 
   * @param id 
   * @param updateCuponDto 
   * @returns 
   */
  async update(id: string, updateCuponDto: UpdateCuponDto) {
    const existcupon = await this.cuponModel.findOne({ code: updateCuponDto.code });
    if (existcupon && existcupon._id.toString() !== id) {
      throw new ConflictException('Cupon already exists');
    }

    if (updateCuponDto.expire) {
      const expireDate = new Date(updateCuponDto.expire);
      const currentDate = new Date();

      if (expireDate.getTime() < currentDate.getTime()) {
        throw new ConflictException('Cupon expired date must be greater than current date');
      }
    }
    const cupon = await this.cuponModel.findByIdAndUpdate(id, updateCuponDto, { new: true }).exec();
    if (!cupon) {
      throw new BadRequestException('Cupon not found');
    }
    return cupon;
  }


  /**
   * remove cupon by id
   * @param id 
   * @returns 
   */
  async remove(id: string) {
    const cupon = await this.cuponModel.findByIdAndDelete(id).exec();
    if (!cupon) {
      throw new BadRequestException('Cupon not found');
    }
    return {"message": "Cupon deleted successfully" };
  }
}
