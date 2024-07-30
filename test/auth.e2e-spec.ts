// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should create a new user', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'testing@mail.com',
        password: '123456',
        fullname: 'testing',
        phone: '123456789',
      })
      .expect(201);
  });

  it('should login the user and return a JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testing@mail.com',
        password: '123456',
      })
      .expect(200);

    console.log('Login response:', response.body);

    expect(response.body).toHaveProperty('accessToken');
  });

  it('should access protected route with JWT token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testing@mail.com',
        password: '123456',
      })
      .expect(200);

    const token = loginResponse.body.accessToken;
    console.log('Generated Token:', token);

    return request(app.getHttpServer())
      .get('/protected/route')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
