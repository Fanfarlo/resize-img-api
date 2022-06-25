import path from 'path';
import imgHelper from '../../helpers/imgHelper';

const originalPath = path.resolve(
  __dirname,
  '../../../images/original/icelandwaterfall.jpg'
);
const resizedPath = path.resolve(
  __dirname,
  '../../../images/resized/icelandwaterfall.jpg'
);

describe('Sharp function', (): void => {
  it('returs a buffer', async () => {
    const sharpImg: Buffer = await imgHelper.resizeImg({
      width: 400,
      height: 400,
      originalPath,
      resizedPath
    });
    expect(sharpImg).toBeInstanceOf(Buffer);
  });

  it('Rejects if something fails', async (): Promise<void> => {
    await expectAsync(
      imgHelper.resizeImg({
        width: 400,
        height: 400,
        originalPath: '',
        resizedPath
      })
    ).toBeRejected();
  });
});
