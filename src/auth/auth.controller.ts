import { Controller, Post, Body, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enums/role.enum';
import { JwtRolesGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto);
  }

  @Post('signUp')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post("forgotPassword")
  forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post("verifyCode")
  @UseGuards(JwtRolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  verifyCode(@Body('code') code: string, @Req() req: Request) {
    if (!code) {
      throw new BadRequestException('Code is required');
    }
    return this.authService.verifyCode(code, req);
  }

  @Post("resetPassword")
  @UseGuards(JwtRolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  resetPassword(@Body('password') password: string, @Req() req: Request) {
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    return this.authService.resetPassword(password, req);
  }
  
}
