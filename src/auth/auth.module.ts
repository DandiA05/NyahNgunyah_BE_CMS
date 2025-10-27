// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user/user.module';
import { ActivityLogModule } from 'src/activity-log/activity-log.module'; // Import the UserModule

@Module({
  imports: [
    UserModule,
    ActivityLogModule, // Include the UserModule here
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
