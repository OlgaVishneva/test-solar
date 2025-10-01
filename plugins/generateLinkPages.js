import path from 'path';
import fs from 'fs';

function generateLinkPages({ directoryPath }) {
  return {
    name: 'generate-pages-plugin',

    configureServer(server) {
      let pagesPageContent = '';

      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/pages.html') {
          const files = fs.readdirSync(directoryPath);

          if (files && files.length > 0) {
            const htmlFiles = files.filter((file) => file.endsWith('.html'));
            const links = htmlFiles.map((file) => {
              const name = path.basename(file, '.html');
              return name;
            });

            pagesPageContent = `
              <!DOCTYPE html>
              <html lang="ru">
              <head>
                <meta charset="UTF-8">
                <title>Ссылки на страницы</title>
                <style>
                  .demo-list {
                    list-style: none;
                    padding: 0;
                  }
            
                  .demo-item {
                    margin-bottom: 10px;
                  }
            
                  .demo-link {
                    display: inline-block;
                    font-size: 22px;
                    line-height: 26px;
                    color: #007BFF;
                    text-decoration: none;
                  }
            
                  .demo-link:hover {
                    text-decoration: underline;
                  }
                </style>
              </head>
              <body>
                <h1>Ссылки на страницы</h1>
                <ul class="demo-list">
                  ${links
                    .map(
                      (link, index) =>
                        `<li class="demo-item"><a class="demo-link" href="${link}.html">
                        ${index + 1}. ${link[0].toUpperCase() + link.slice(1)}.html
                        </a>
                      </li>`
                    )
                    .join('\n')}
                </ul>
              </body>
              </html>
            `;

            console.log(`Страница "pages.html" успешно сгенерирована`);
          }

          res.setHeader('Content-Type', 'text/html');
          res.end(pagesPageContent);
        } else {
          next();
        }
      });
    }
  };
}

export default generateLinkPages;
