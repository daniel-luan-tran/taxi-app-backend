import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  public serializeUser(
    user: any,
    done: (err: Error | null, id?: any) => void,
  ): void {
    done(null, user);
  }

  public deserializeUser(
    payload: unknown,
    done: (err: Error | null, payload?: unknown) => void,
  ): void {
    done(null, payload);
  }
}
