import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class JwtRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) throw new UnauthorizedException('Invalid authorization header format');

    try {
      interface DecodedToken {
        userId: string;
        email: string;
        iat?: number;
        exp?: number;
      }

      let decoded: DecodedToken;
      try {
        decoded = this.jwtService.verify<DecodedToken>(token);
      } catch {
        throw new UnauthorizedException('Token is invalid or expired');
      }
      
      
      const user = await this.UserModel.findById(decoded.userId.toString()).exec();
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      const userRoles: string[] = Array.isArray(user.role) ? user.role : [user.role];

      if (!roles || roles.length === 0) {
        request['InfUser'] = user; 
        return true;
      }

      const hasRole = () => roles.some((role) => userRoles.includes(role));

      if (!hasRole()) {
        throw new UnauthorizedException(
          'You do not have permission to access this resource',
        );
      }

      if (user.passwordChangeAt){
        const passwordChangeAt = Math.floor(user.passwordChangeAt.getTime() / 1000);
        if (decoded.iat && decoded.iat < passwordChangeAt) {
          throw new UnauthorizedException('Password has been changed, please log in again');
        }
      }

      if (user.isActive === false) {
        throw new UnauthorizedException('User is inactive');
      }

      request['InfUser'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Unauthorized');
    }
  }
}
