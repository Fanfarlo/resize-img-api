import supertest from 'supertest';
import app from '..';

const request = supertest(app);

describe('Test endpoind response', () => {
  it('Status 200', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
});
