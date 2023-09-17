import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import {
  OIDCStrategy,
  IOIDCStrategyOptionWithRequest,
} from 'passport-azure-ad';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const ID_METADATA = process.env.ID_METADATA;
const URL_CALLBACK = process.env.URL_CALLBACK;
const URL_CALLBACK_FOR_STAFFS = process.env.URL_CALLBACK_FOR_STAFFS;
const URL_CALLBACK_FOR_DRIVERS = process.env.URL_CALLBACK_FOR_DRIVERS;

@Injectable()
export class OIDCStrategyPassport extends PassportStrategy(
  OIDCStrategy,
  'azure-ad',
) {
  constructor() {
    const options: IOIDCStrategyOptionWithRequest = {
      passReqToCallback: true,
      identityMetadata: ID_METADATA,
      clientID: CLIENT_ID,
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: URL_CALLBACK,
      allowHttpForRedirectUrl: true,
      clientSecret: CLIENT_SECRET,
      validateIssuer: true,
      scope: ['openid', 'profile', 'email', 'user.read', 'offline_access'],
    };
    super(options);
  }
}

@Injectable()
export class OIDCStrategyPassportForStaffs extends PassportStrategy(
  OIDCStrategy,
  'azure-ad-for-staffs',
) {
  constructor() {
    const options: IOIDCStrategyOptionWithRequest = {
      passReqToCallback: true,
      identityMetadata: ID_METADATA,
      clientID: CLIENT_ID,
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: URL_CALLBACK_FOR_STAFFS,
      allowHttpForRedirectUrl: true,
      clientSecret: CLIENT_SECRET,
      validateIssuer: true,
      scope: ['openid', 'profile', 'email', 'user.read', 'offline_access'],
    };
    super(options);
  }
}

@Injectable()
export class OIDCStrategyPassportForDrivers extends PassportStrategy(
  OIDCStrategy,
  'azure-ad-for-drivers',
) {
  constructor() {
    const options: IOIDCStrategyOptionWithRequest = {
      passReqToCallback: true,
      identityMetadata: ID_METADATA,
      clientID: CLIENT_ID,
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: URL_CALLBACK_FOR_DRIVERS,
      allowHttpForRedirectUrl: true,
      clientSecret: CLIENT_SECRET,
      validateIssuer: true,
      scope: ['openid', 'profile', 'email', 'user.read', 'offline_access'],
    };
    super(options);
  }
}
