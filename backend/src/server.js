'use strict';

const http = require('http');
const config = require('./config');
const logger = require('./utils/logger');
const createApp = require('./app');

function startServer() {
  const app = createApp();
  const server = http.createServer(app);

  server.listen(config.port, () => {
    logger.info(`ArtLoop API listening on :${config.port}`, {
      env: config.env,
      cors: config.cors.allowAll ? '*' : config.cors.origins,
    });
  });

  const shutdown = (signal) => {
    logger.warn(`Received ${signal}, shutting down gracefully...`);
    server.close((err) => {
      if (err) {
        logger.error('Error during shutdown', { message: err.message });
        process.exit(1);
      }
      process.exit(0);
    });
    // Hard-stop if it takes too long.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  ['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', { reason: String(reason) });
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', { message: err.message, stack: err.stack });
    shutdown('uncaughtException');
  });

  return server;
}

startServer();
