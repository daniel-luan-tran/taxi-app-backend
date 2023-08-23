import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { testActiveUser, testUsers } from './data/users';

describe('Users', () => {
  let app: INestApplication;
  const usersService = {
    findAll: () => Promise.resolve(testUsers),
    findById: () => Promise.resolve(testActiveUser),
    create: () => Promise.resolve(testActiveUser),
    update: () => Promise.resolve(testActiveUser),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET users`, () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect({
      data: usersService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
