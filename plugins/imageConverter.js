import sharp from 'sharp';
import path from 'path';
import { promisify } from 'util';
import { glob } from 'glob';
import chokidar from 'chokidar';
import fs from 'fs';

const unlinkAsync = promisify(fs.unlink);
const accessAsync = promisify(fs.access);

export function convertImages({ imagePattern, convertWebp = true, convertAvif = true }) {
  const convertImage = async (image) => {
    const { dir, name } = path.parse(image);

    if (convertWebp) {
      await sharp(image)
        .webp()
        .toFile(path.join(dir, `${name}.webp`));
    }

    if (convertAvif) {
      await sharp(image)
        .avif()
        .toFile(path.join(dir, `${name}.avif`));
    }
  };

  const handleExistingImages = () => {
    const images = glob.sync(imagePattern);
    const convertPromises = images.map((image) => convertImage(image));
    return Promise.all(convertPromises);
  };

  const handleNewImage = async (filePath) => {
    await convertImage(filePath);
  };

  const handleImageDeletion = async (filePath) => {
    const { dir, name } = path.parse(filePath);
    const webpFile = path.join(dir, `${name}.webp`);
    const avifFile = path.join(dir, `${name}.avif`);

    try {
      const [webpExists, avifExists] = await Promise.all([
        accessAsync(webpFile, fs.constants.F_OK)
          .then(() => true)
          .catch(() => false),
        accessAsync(avifFile, fs.constants.F_OK)
          .then(() => true)
          .catch(() => false)
      ]);

      const deletionPromises = [];

      if (webpExists && convertWebp) {
        deletionPromises.push(unlinkAsync(webpFile));
      }

      if (avifExists && convertAvif) {
        deletionPromises.push(unlinkAsync(avifFile));
      }

      await Promise.all(deletionPromises);

      console.log('Files deleted successfully.');
    } catch (err) {
      console.error('Error deleting files:', err);
    }
  };

  const watchImages = () => {
    handleExistingImages();

    const watcher = chokidar.watch(imagePattern, { ignoreInitial: true });

    watcher.on('add', (filePath) => {
      handleNewImage(filePath);
    });

    watcher.on('change', (filePath) => {
      handleNewImage(filePath);
    });

    watcher.on('unlink', (filePath) => {
      handleImageDeletion(filePath);
    });
  };

  return {
    name: 'convert-images',
    configureServer() {
      watchImages();
    }
  };
}

export default convertImages;
