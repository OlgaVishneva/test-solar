export function customHmr() {
  return {
    name: 'custom-hmr',
    enforce: 'post',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html')) {
        server.ws.send({
          type: 'full-reload',
          path: '*'
        });
      }
    }
  };
}
