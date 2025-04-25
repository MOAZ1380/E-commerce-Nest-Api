import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto'
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
      @InjectModel(User.name) private UserModel: Model<UserDocument>,
      private readonly jwtService: JwtService,
      private readonly emailService: EmailService,
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


  async forgotPassword(email: string) {
   const user = await this.UserModel.findOne({ email }).exec()
   if (!user) {
    throw new BadRequestException('User not found')
   }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedCode = await bcrypt.hash(code, 10)

    user.passwordResetCode = hashedCode
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
    user.passwordResetVerified = false

    await this.emailService.sendMail(email, 'Reset Your Password', code);

    const payload = { userId: user._id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    await user.save()
    return { message: 'Password reset code sent to your email', token }
  }

  async verifyCode(code: string, req: Request) {
    const userId = req['InfUser']._id as UserDocument;
    const user = await this.UserModel.findById(userId).exec();
  
    if (!user) {
      throw new BadRequestException('User not found');
    }
  
    if (!user.passwordResetCode) {
      throw new BadRequestException('No password reset code found');
    }
  
    if (user.passwordResetVerified) {
      throw new BadRequestException('Password reset code already verified');
    }
  
    const isCodeValid = await bcrypt.compare(code, user.passwordResetCode);
    if (!isCodeValid) {
      throw new BadRequestException('Invalid password reset code');
    }
  
    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Password reset code has expired');
    }
  
    user.passwordResetVerified = true;
    user.passwordResetCode = '';
    user.passwordResetExpires = null;
  
    const token = this.jwtService.sign({ userId: user._id }, { expiresIn: '24h' });
    await user.save();
    return { message: 'Password reset code verified successfully', token };
  }
  
  async resetPassword(newPassword: string, req: Request) {
    const userId = req['InfUser']._id as UserDocument;
    const user = await this.UserModel.findById(userId).exec();
  
    if (!user) {
      throw new BadRequestException('User not found');
    }
  
    if (!user.passwordResetVerified) {
      throw new BadRequestException('Password reset code not verified');
    }
  
    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Password reset code has expired');
    }
  
    // Encrypt the new password before saving
    user.password = newPassword;
  
    const token = this.jwtService.sign({ userId: user._id }, { expiresIn: '10d' });
    await user.save();
  
    return { message: 'Password reset successfully', token };
  }
  
}

