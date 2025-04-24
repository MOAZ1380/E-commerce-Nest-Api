import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto'
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
      @InjectModel(User.name) private UserModel: Model<UserDocument>,
      private readonly jwtService: JwtService
    ) {}
  
    async signIn(loginAuthDto: LoginAuthDto) {
      const { email, password } = loginAuthDto;
    
      const existingUser = await this.UserModel.findOne({ email }).select('+password').exec();
      if (!existingUser || !existingUser.password) {
        throw new UnauthorizedException('Invalid credentials');
      }
    
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('password or email is incorrect');
      }
    
      const payload = { userId: existingUser._id, email: existingUser.email };
    
      const token = this.jwtService.sign(payload, {
        expiresIn: '1h',
      });
    
      return {
        user: existingUser,
        token,
      };
    }
    


  async signUp(createAuthDto: CreateAuthDto) {
    const { email } = createAuthDto;

    try {
      const existingUser = await this.UserModel.findOne({ email }).exec();
      if ( existingUser) {
        throw new ConflictException('this user already exists Please login');
      }

      const newUser = await this.UserModel.create(createAuthDto);
      if (!newUser) {
        throw new ConflictException('Error creating user');
      }
      const payload = { userId: newUser._id, email: newUser.email };
      const token = this.jwtService.sign(payload, {
        expiresIn: '1h',
      });

      return {
        user: newUser,
        token,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw new ConflictException('Error creating user');
    }
  }

             
}

