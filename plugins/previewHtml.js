function previewHtml() {
  return {
    name: 'remove-module-attributes',
    transformIndexHtml(html) {
      if (process.env.COMMAND === 'build-preview') {
        html = html.replace(/<script type="module" crossorigin(.*?)>/g, '<script defer$1>');
        html = html.replace(/<link rel="stylesheet" crossorigin(.*?)>/g, '<link rel="stylesheet"$1>');
      }
      return html;
    }
  };
}

export default previewHtml;
