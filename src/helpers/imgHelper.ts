import { promises as fsPromises } from 'fs';
import sharp from 'sharp';

interface imageOptions {
  width: number;
  height: number;
  originalPath: string;
  resizedPath: string;
}

const resizeImg = async ({
  width,
  height,
  originalPath,
  resizedPath
}: imageOptions): Promise<Buffer> => {
  const imgData: Buffer | null = await fsPromises
    .readFile(originalPath)
    .catch(() => null);

  if (!imgData) {
    return Promise.reject();
  }

  const sharpImg = await sharp(imgData)
    .resize(width, height)
    .toBuffer()
    .catch(() => null);

  if (!sharpImg) {
    return Promise.reject();
  }

  return fsPromises
    .writeFile(resizedPath, sharpImg)
    .then(() => {
      return sharpImg;
    })
    .catch(() => {
      return Promise.reject();
    });
};

export default { resizeImg };
