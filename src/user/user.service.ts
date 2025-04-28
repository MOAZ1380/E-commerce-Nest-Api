import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express'; 
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateLoggedUserDto } from './dto/updateLoggedUser.dto';



@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>
  ) {}

  /**
   * Create a new user
   * @param createUserDto - data transfer object containing user data
   * @param file - uploaded profile image file
   * @returns created user document
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
   * Get user by ID
   * @param id - user ID
   * @returns user document
  */
  async findOne(id: string) {
    const existingUser = await this.UserModel.findById(id).exec();
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    return existingUser;
  }


  /**
   * Update user by ID
   * @param id - user ID
   * @param updateUserDto - updated user data
   * @param file - new profile image file
   * @returns updated user document
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
   * Delete user by ID
   * @param id - user ID
   * @returns deletion success message
  */
  async remove(id: string) {
    const existingUser = await this.UserModel.findById(id).exec();
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    await this.UserModel.findByIdAndDelete(id).exec();

    return {"message": "User deleted successfully" };
  }


  /**
   * Get data of the currently logged-in user
   * @param request - Express request object containing user data
   * @returns fresh user document from the database
  */
  async getLoggedUserData(request: Request): Promise<UserDocument> {
    const user = request['InfUser'] as UserDocument;
    
    if (!isValidObjectId(user._id)) {
      throw new BadRequestException('Invalid user ID');
    }
    
    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }
  
    const freshUser = await this.UserModel.findById(user._id).exec();
    if (!freshUser) {
      throw new UnauthorizedException('User not found in DB');
    }
  
    return freshUser;
  }


  /**
   * Update the logged-in user's password
   * @param request - Express request object with new password
   * @returns success message
  */
  async updateLoggedUserPassword(request: Request) {
    const user = request['InfUser'] as UserDocument;
    
    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    const newPassword = (request.body as { newPassword: string }).newPassword;
    if (!newPassword) {
      throw new BadRequestException('New password is required');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password cannot be the same as the old password');
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatePassword = await this.UserModel.findByIdAndUpdate(user._id,
       {
        password: hashedPassword,
        passwordChangeAt: new Date()
       }, { new: true }).exec();

    if (!updatePassword) {
      throw new InternalServerErrorException('Failed to update password. Please try again later.');
    }
  
    return { message: 'Password updated successfully please login again' };
  }


  /**
   * Update the logged-in user's data
   * @param updateLoggedUserDto - updated user data
   * @param file - new profile image file
   * @param request - Express request object containing user info
   * @returns updated user document
  */
  async updateLoggedUserData (updateLoggedUserDto: UpdateLoggedUserDto, file: Express.Multer.File, request: Request) {
    const user = request['InfUser'] as UserDocument;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    const existingUser = await this.UserModel.findById(user._id).exec();
    if (!existingUser) {
      throw new UnauthorizedException('User not found in DB');
    }

    const existingEmail = await this.UserModel.findOne({ email: updateLoggedUserDto.email });
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      throw new ConflictException('Email already exists');
    }

    const imagePath = file && file.path ? file.path : undefined;
    const updatedUser = await this.UserModel.findByIdAndUpdate(
      user._id,
      {
        ...updateLoggedUserDto,
        profileImg: imagePath
      },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new InternalServerErrorException('Failed to update user data. Please try again later.');
    }

    return { message: 'User data updated successfully', user: updatedUser };

  }

  /**
   * Deactivate (soft delete) the logged-in user's account
   * @param request - Express request object containing user info
   * @returns deactivation success message
  */
  async deleteLoggedUserAccount(request: Request) {
    const user = await this.UserModel.findByIdAndUpdate((request['InfUser'] as UserDocument)._id,
      { isActive: false },
      { new: true })
        .exec();

    if (!user) {
      throw new UnauthorizedException('User not found in DB');
    }

    return { message: 'User account deleted successfully' };
  }
}
