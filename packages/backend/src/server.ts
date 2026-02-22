import cors from '@fastify/cors';
import fastify from 'fastify';

import './db';
import { gameRoutes } from './routes/games';
import { platformRoutes } from './routes/platforms';

const server = fastify({ logger: true });

server.register(cors);
server.register(gameRoutes, { prefix: '/api' });
server.register(platformRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await server.listen({ port: 5000 });
    server.log.info('Server running on http://localhost:5000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
