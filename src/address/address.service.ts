import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './entities/address.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private AddressModel: Model<AddressDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>
  ) {}

  /**
   * create address
   * @param createAddressDto 
   * @param req 
   * @returns 
   */
  async create(createAddressDto: CreateAddressDto, req: Request) {
    const user = req['InfUser'] as UserDocument;
    const userId = user._id;

    const existingUser = await this.UserModel.findById(userId).exec();
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const newAddress = new this.AddressModel(createAddressDto);
    await newAddress.save()

    existingUser.address.push(newAddress._id);
    await existingUser.save();

    return newAddress

  }

  /**
   * find all addresses of the user
   * @param req 
   * @returns 
  */
  async findAll(req: Request) {
    const user = req['InfUser'] as UserDocument;
    const userId = user._id;

    const existingUser = await this.UserModel.findById(userId).exec();
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const addresses = await this.AddressModel.find({ _id: { $in: existingUser.address } }).exec();

    return addresses;
  }

  /**
   * find address by id
   * @param id 
   * @returns 
  */
  async findOne(id: string) {
    const address = await this.AddressModel.findById(id).exec();
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    return address;
  }

  /**
   * update address by id
   * @param id 
   * @param updateAddressDto 
   * @returns 
  */
  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.AddressModel.findByIdAndUpdate(id, updateAddressDto, { new: true }).exec();
    if (!address) {
      throw new BadRequestException('Address not found');
    }

    return address;
  }

  /**
   * remove address by id
   * @param id 
   * @returns 
  */
  async remove(id: string) {
    const address = await this.AddressModel.findByIdAndDelete(id).exec();
    if (!address) {
      throw new BadRequestException('Address not found');
    }

    return { message: 'Address deleted successfully' };
  }
}
