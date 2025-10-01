function logCustomMessages(options) {
  const { messages } = options || {};
  let hasLoggedMessages = false;

  return {
    name: 'custom-console-messages',

    configureServer() {
      if (!hasLoggedMessages && messages && Array.isArray(messages)) {
        messages.forEach((message) => {
          console.log(message);
        });

        hasLoggedMessages = true;
      }
    }
  };
}

export default logCustomMessages;
