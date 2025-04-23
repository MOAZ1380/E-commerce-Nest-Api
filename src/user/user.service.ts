import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>
  ) {}

  /**
   * * Create a new user
   * @param createUserDto 
   * @param file 
   * @returns 
   */
  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    // Check if the email already exists
    const existingUser = await this.UserModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const imagePath = file && file.path ? file.path : undefined;
  
    const newUser = new this.UserModel({
      ...createUserDto,
      profileImg: imagePath
    });
  
    return await newUser.save();
  }
  

  /**
   * find all users
   * @returns Array of users
   */
  findAll() {
    return this.UserModel.find().exec();
  }


  /**
   * find user by Id
   * @param id 
   * @returns 
  */
  async findOne(id: string) {
    const existingUser = await this.UserModel.findById(id).exec();
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    return existingUser;
  }


  /**
   * 
   * @param id 
   * @param updateUserDto 
   * @param file 
   * @returns 
  */
  async update(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    const existingUser = await this.UserModel.findById(id).exec();
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const existingEmail = await this.UserModel.findOne({ email: updateUserDto.email });
    if (existingEmail && existingEmail._id.toString() !== id) {
      throw new ConflictException('Email already exists');
    }

    const imagePath = file && file.path ? file.path : undefined;
    
    const updatedUser = await this.UserModel.findByIdAndUpdate(
      id,
      {
        ...updateUserDto,
        profileImg: imagePath
      },
      { new: true }
    ).exec();
    
    return {"message": "User updated successfully", user: updatedUser };
  }


  /**
   * 
   * @param id 
   * @returns 
  */
  async remove(id: string) {
    const existingUser = await this.UserModel.findById(id).exec();
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    await this.UserModel.findByIdAndDelete(id).exec();

    return {"message": "User deleted successfully" };
  }
}
