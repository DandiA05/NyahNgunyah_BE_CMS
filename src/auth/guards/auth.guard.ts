// auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    // Add your token verification logic here (e.g., call verifyToken from AuthService)
    // Make sure AuthService.verifyToken returns a decoded token if valid
    // If AuthService.verifyToken throws an error, it will be caught by NestJS and result in an UnauthorizedException
    // If the token is valid, return true; otherwise, return false

    return token;
  }
}
