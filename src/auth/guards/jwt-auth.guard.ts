import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request.headers);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const user = await this.validateToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const account = this.userService.findById(user.id);
    // Attach the user to the request for later use in controllers
    request.user = account;

    return true;
  }

  private extractTokenFromHeaders(headers: any): string | null {
    const authorization = headers['authorization'];

    if (!authorization) {
      return null;
    }

    const parts = authorization.split(' ');

    if (parts.length === 2 && parts[0].toLowerCase() === 'jwt') {
      return parts[1];
    }

    return null;
  }

  private async validateToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token, {
        publicKey: process.env.SECRET_KEY_JWT,
      });
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token', error.message);
    }
  }
}
