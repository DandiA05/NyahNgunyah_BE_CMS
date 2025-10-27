// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { User } from 'src/user/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    console.log(`cup`, user);

    if (user && (await this.comparePasswords(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
  private async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(plainTextPassword, hashedPassword);
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      nama_depan: user.firstName,
    };

    const dataActivityLog = {
      user_id: user.id,
      activity: 'login',
    };

    const expiresIn = 60 * 60 * 24; // 24 hours in seconds

    const accessToken = this.jwtService.sign(payload, { expiresIn });
    await this.activityLogService.create(dataActivityLog);
    return {
      access_token: accessToken,
      payload: payload,
    };
  }

  async logout(user: User) {
    const dataActivityLog = {
      user_id: user.id,
      activity: 'logout',
    };

    await this.activityLogService.create(dataActivityLog);

    return {
      message: 'Logout Success',
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.jwtService.verify(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
