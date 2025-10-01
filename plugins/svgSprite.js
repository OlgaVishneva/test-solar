import { resolve } from 'path';
import { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';

export function spriteSvg({ iconsDirectory, spriteFilePath }) {
  const iconsFolder = resolve(process.cwd(), iconsDirectory);
  const spriteFile = resolve(process.cwd(), spriteFilePath);

  if (!existsSync(iconsFolder)) {
    if (existsSync(spriteFile)) {
      unlinkSync(spriteFile);
      console.log(`Файл ${spriteFile} был удален, так как папка с иконками не существует.`);
    }

    return;
  }

  return {
    name: 'svg-sprite',
    configureServer({ watcher, ws }) {
      generateAndWriteSprite();

      watcher.add(iconsFolder);

      watcher.on('change', (filePath) => {
        if (filePath.endsWith('.svg')) {
          generateAndWriteSprite();
          ws.send({ type: 'full-reload' });
        }
      });

      watcher.on('add', (filePath) => {
        if (filePath.endsWith('.svg')) {
          generateAndWriteSprite();
          ws.send({ type: 'full-reload' });
        }
      });
    },
    closeBundle() {
      generateAndWriteSprite();
    }
  };

  function generateAndWriteSprite() {
    const spriteContent = generateSpriteContent();
    writeFileSync(spriteFile, spriteContent);
  }

  function generateSpriteContent() {
    const svgFiles = readdirSync(iconsFolder).filter((file) => file.endsWith('.svg'));

    let symbolsContent = '';

    for (const svgFile of svgFiles) {
      const filePath = resolve(iconsFolder, svgFile);
      const iconContent = readFileSync(filePath, 'utf-8');
      const symbolId = svgFile.replace('.svg', '');
      const startTagIndex = iconContent.indexOf('<svg');
      const endTagIndex = iconContent.lastIndexOf('</svg>');
      const iconSvgContent = iconContent.slice(startTagIndex, endTagIndex + 6);
      const viewBoxMatch = iconSvgContent.match(/viewBox="([^"]+)"/);
      const viewBoxAttr = viewBoxMatch ? `viewBox="${viewBoxMatch[1]}"` : '';
      const symbolElement = iconSvgContent
        .replace(/<svg[^>]+>/, `<symbol id="${symbolId}" ${viewBoxAttr}>`)
        .replace('</svg>', '</symbol>');
      symbolsContent += symbolElement;
    }

    const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg">${symbolsContent}</svg>`;

    return spriteContent;
  }
}

export default spriteSvg;
