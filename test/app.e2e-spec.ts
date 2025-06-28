import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should start the application successfully', () => {
    expect(app).toBeDefined();
  });

  it('should have the API prefix configured', () => {
    return request(app.getHttpServer()).get('/api').expect(404); // Should return 404 since no routes are defined at /api
  });

  afterAll(async () => {
    await app.close();
  });
});
