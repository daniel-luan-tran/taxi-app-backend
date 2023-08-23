import { UserEntity } from 'src/users/entities/user.entity';

declare module 'express-session' {
  export interface SessionData {
    passport: { user: UserEntity };
  }
}
