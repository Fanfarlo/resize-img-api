import supertest from 'supertest';
import { promises as fsPromises } from 'fs';
import path from 'path';
import app from '../../..';
import { Stats } from 'fs';
import sizeOf from 'image-size';

const request = supertest(app);

describe('get api images', () => {
  it('Reponse with status 400 if parameters does not exist', async () => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(400);
  });

  it('Response with status 400 if one parameters is missing ', async () => {
    const response = await request.get('/api/images?filename=test&height=100');
    expect(response.status).toBe(400);
  });

  it('Response with status 404 if image doesnt exist', async () => {
    const response = await request.get(
      '/api/images?filename=test&width=100&height=100'
    );
    expect(response.status).toBe(404);
  });

  it('Response with status 200 if image and parameters exist', async () => {
    const response = await request.get(
      '/api/images?filename=icelandwaterfall&height=100&width=100'
    );
    expect(response.status).toBe(200);
  });

  it('created a resized version of the image', (done): void => {
    request
      .get('/api/images?filename=icelandwaterfall&height=200&width=200')
      .then(() => {
        fsPromises
          .stat(
            path.resolve(
              __dirname,
              '../../../images/resized/icelandwaterfall-200x200.jpg'
            )
          )
          .then((fileStat: Stats) => expect(fileStat).not.toBeNull());
        done();
      });
  });

  it('create a resized img with the exact width and height', (done): void => {
    request.get('/api/images?filename=fjord&height=300&width=300').then(() => {
      const dimensions = sizeOf(
        path.resolve('./images/resized/fjord-300x300.jpg')
      );
      expect(dimensions.height).toEqual(300);
      expect(dimensions.width).toEqual(300);
      done();
    });
  });
});
