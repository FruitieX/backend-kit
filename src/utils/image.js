import Jimp from 'jimp';

export const resizeImage = image =>
  new Promise((resolve, reject) =>
    Jimp.read(image).then(readImage =>
      readImage
        .cover(512, 512)
        .getBuffer(
          Jimp.MIME_PNG,
          (err, data) => (err ? reject(err) : resolve(data)),
        ),
    ),
  );

export default resizeImage;
