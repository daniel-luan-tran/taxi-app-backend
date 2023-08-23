import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import {
  VerifyCallback,
  BearerStrategy,
  IBearerStrategyOptionWithRequest,
  ITokenPayload,
} from 'passport-azure-ad';
import { AzureUsersService } from 'src/users/azure-users.service';

const CLIENT_ID = process.env.CLIENT_ID;
const ID_METADATA = process.env.ID_METADATA;

@Injectable()
export class BearerStrategyPassport extends PassportStrategy(
  BearerStrategy,
  'bearer',
) {
  constructor(private readonly azureUsersService: AzureUsersService) {
    const options: IBearerStrategyOptionWithRequest = {
      passReqToCallback: true,
      clientID: CLIENT_ID,
      identityMetadata: ID_METADATA,
    };
    super(options);
  }

  public async validate(
    request: any,
    token: ITokenPayload,
    done: VerifyCallback,
  ) {
    try {
      console.log('Verifying token');
      // Check expire
      const tokenExpire = token.exp;
      if (tokenExpire < Math.floor(Date.now() / 1000))
        done(new UnauthorizedException('Invalid token'));

      const azureOid = token.oid || token.sub;
      const userProfile = await this.azureUsersService.findByAzureOid(azureOid);
      if (!userProfile) done(new UnauthorizedException('Invalid token'));
      done(null, userProfile);
    } catch (error) {
      done(new UnauthorizedException('Invalid token'));
    }
  }
}
