// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Request,
  Req,
  Res,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { User } from 'src/user/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      res.status(200).json({ message: 'Invalid credentials', status: 401 });
    }

    const result = await this.authService.login(user);
    res.status(200).send(result);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res() res: Response) {
    const user: User = req.user;
    console.log(req);

    const response = await this.authService.logout(user);
    res.status(200).send(response);
  }

  @UseGuards(AuthGuard)
  @Get('verify-token')
  async verifyToken(
    @Headers('authorization') token: string,
    @Res() res: Response,
  ): Promise<any> {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const decodedToken = await this.authService.verifyToken(
      token.split(' ')[1],
    );
    // return `Token is valid. Decoded data: ${JSON.stringify(decodedToken)}`;
    res.status(200).send(decodedToken);
  }
}
