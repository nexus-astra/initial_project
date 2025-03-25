import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Signin (POST)', async () => {
    const user = {
      email: 'admin@gmail.com',
      password: 'P@ssw0rd',
    };
    const APPLICATION_JSON = 'application/json';
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(user)
      .set('Accept', APPLICATION_JSON);
    const { data, success } = response.body as {
      data: object;
      success: boolean;
    };
    expect(success === true).toBe(true);
    expect(typeof data === 'object').toBe(true);
    expect(response.statusCode).toBe(201);
  });
});
