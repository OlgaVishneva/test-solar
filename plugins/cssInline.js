function cssInline({ inline }) {
  return {
    name: 'css-inline',
    enforce: 'pre',
    resolveId(id, importer) {
      if (id.endsWith('.scss')) {
        return this.resolve(
          !inline && process.env.NODE_ENV === 'development' ? id + '?inline' : id,
          importer
        );
      }
    },
    transformIndexHtml(html) {
      if (!inline && process.env.NODE_ENV === 'development') {
        return html.replace('</head>', `<link rel="stylesheet" href="scss/main.scss">` + '</head>');
      } else {
        return html;
      }
    }
  };
}

export default cssInline;
