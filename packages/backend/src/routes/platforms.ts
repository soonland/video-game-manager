import {
  CreatePlatformBody,
  CreateResponse,
  DeleteResponse,
  ErrorResponse,
  Platform,
  PlatformResponse,
  PlatformsListResponse,
  UpdatePlatformBody,
  UpdateResponse,
} from '@vgm/types';
import { FastifyInstance } from 'fastify';

import db from '../db';

export async function platformRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get<{
    Reply: PlatformsListResponse | ErrorResponse;
  }>('/platforms', async (request, reply) => {
    const sql = 'SELECT * FROM platforms';
    try {
      const protocol = request.protocol;
      const hostname = request.hostname;
      const port = request.socket.localPort;

      const rows = db.prepare(sql).all() as Platform[];
      const platforms: Platform[] = rows.map((platform) => ({
        ...platform,
        href: `${protocol}://${hostname}:${port}/api/platforms/${platform.id}`,
      }));
      reply.send({ platforms });
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });

  fastify.get<{
    Params: { id: string };
    Reply: PlatformResponse | ErrorResponse;
  }>('/platforms/:id', async (request, reply) => {
    const { id } = request.params;
    const sql = 'SELECT * FROM platforms WHERE id = ?';
    try {
      const row = db.prepare(sql).get(id) as Platform | undefined;
      if (row) {
        const protocol = request.protocol;
        const hostname = request.hostname;
        const port = request.socket.localPort;

        const platform: Platform = {
          ...row,
          href: `${protocol}://${hostname}:${port}/api/platforms/${row.id}`,
        };
        reply.send({ platform });
      } else {
        reply.status(404).send({ error: 'Platform not found' });
      }
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });

  fastify.post<{
    Body: CreatePlatformBody;
    Reply: CreateResponse | ErrorResponse;
  }>('/platforms', async (request, reply) => {
    const { name, year } = request.body;
    const sql = 'INSERT INTO platforms (name, year) VALUES (?, ?)';
    try {
      const info = db.prepare(sql).run(name, year);
      reply.send({ message: 'Platform added successfully!', id: Number(info.lastInsertRowid) });
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });

  fastify.put<{
    Params: { id: string };
    Body: UpdatePlatformBody;
    Reply: UpdateResponse | ErrorResponse;
  }>('/platforms/:id', async (request, reply) => {
    const { id } = request.params;
    const { name, year } = request.body;
    const sql = 'UPDATE platforms SET name = ?, year = ? WHERE id = ?';
    try {
      db.prepare(sql).run(name, year, id);
      reply.send({ message: 'Platform updated successfully!' });
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });

  fastify.delete<{
    Params: { id: string };
    Reply: DeleteResponse | ErrorResponse;
  }>('/platforms/:id', async (request, reply) => {
    const { id } = request.params;
    const sql = 'DELETE FROM platforms WHERE id = ?';
    try {
      db.prepare(sql).run(id);
      reply.send({ message: 'Platform deleted successfully!' });
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });
}
