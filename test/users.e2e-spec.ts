import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  interface User {
    uuid: string;
  }
  let app: INestApplication;
  let userToken = '';
  let userData: User = {
    uuid: '',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const user = {
      email: 'admin@example.com',
      password: 'P@ssw0rd',
    };
    const APPLICATION_JSON = 'application/json';
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(user)
      .set('Accept', APPLICATION_JSON);
    const { access_token } = response.body as {
      access_token: string;
    };
    userToken = access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a list of users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`);
    const { data, success } = response.body as {
      data: Array<User>;
      success: boolean;
    };
    userData = data[0];
    expect(success === true).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(data.length > 0).toBe(true);
  });

  it('should return one user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userData.uuid}`)
      .set('Authorization', `Bearer ${userToken}`);
    const { data, success } = response.body as {
      data: User;
      success: boolean;
    };
    expect(success === true).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(typeof data === 'object').toBe(true);
  });

  it('should update a user', async () => {
    const payload = {
      ...userData,
      firstName: 'John',
      lastName: 'Doe',
    };
    const response = await request(app.getHttpServer())
      .patch(`/users/${userData.uuid}`)
      .send(payload)
      .set('Authorization', `Bearer ${userToken}`);
    const { success } = response.body as {
      success: boolean;
    };
    expect(success === true).toBe(true);
    expect(response.statusCode).toBe(200);
  });

  it('should delete a user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${userData.uuid}`)
      .set('Authorization', `Bearer ${userToken}`);
    const { success } = response.body as {
      success: boolean;
    };
    expect(success === true).toBe(true);
    expect(response.statusCode).toBe(200);
  });
});
