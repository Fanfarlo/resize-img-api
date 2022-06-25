import { promises as fsPromises } from 'fs';
import path from 'path';
import imgHelper from '../../helpers/imgHelper';
import { Stats } from 'fs';
import express, { Request, Response } from 'express';

const imgRouter = express.Router();

//Capture query params
imgRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const filename = req.query['filename'];
  const height = req.query['height']
    ? parseInt(req.query['height'] as string, 10)
    : null;
  const width = req.query['width']
    ? parseInt(req.query['width'] as string, 10)
    : null;

  //Check if params are correct
  if (!filename || !height || !width) {
    res.status(400).send('Params are not correct');
    return;
  }

  const originalPath = `${path.resolve(
    __dirname,
    `../../../images/original/${filename}.jpg`
  )}`;
  const resizedPath = `${path.resolve(
    __dirname,
    `../../../images/resized/${filename}-${height}x${width}.jpg`
  )}`;

  //check original image path exist
  const checkOriginalPath: Stats | null = await fsPromises
    .stat(originalPath)
    .catch(() => {
      res.status(404).send('Original img exist');
      return null;
    });

  if (!checkOriginalPath) {
    return;
  }
  //check if resized image exist
  const checkResizedPath: Stats | null = await fsPromises
    .stat(resizedPath)
    .catch(() => {
      return null;
    });

  if (checkResizedPath) {
    fsPromises
      .readFile(resizedPath)
      .then((resizedData: Buffer) => {
        res.status(200).contentType('jpg').send(resizedData);
      })
      .catch(() => {
        res.status(500).send('Error to process img');
      });
  } else {
    //resize img
    imgHelper
      .resizeImg({
        originalPath,
        resizedPath,
        height,
        width
      })
      .then((resizedImg: Buffer) => {
        res.status(200).contentType('jpg').send(resizedImg);
      })
      .catch(() => {
        res.status(500).send('Error to process img');
      });
  }
});

export default imgRouter;
