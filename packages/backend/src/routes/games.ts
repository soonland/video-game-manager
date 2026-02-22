import {
  CreateGameBody,
  CreateResponse,
  DeleteResponse,
  ErrorResponse,
  Game,
  GameRaw,
  GamesListQuery,
  GamesListResponse,
  GameRawResponse,
  GameResponse,
  Platform,
  UpdateGameBody,
  UpdateResponse,
} from '@vgm/types';
import { FastifyInstance } from 'fastify';

import db from '../db';

export async function gameRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get<{
    Querystring: GamesListQuery;
    Reply: GamesListResponse | ErrorResponse;
  }>('/games', async (request, reply) => {
    const { $expand, $filter, $search } = request.query;
    let sql =
      $expand === 'platform'
        ? `SELECT games.*, platforms.name as platform_name, platforms.year as platform_year, platforms.id as platform_id
           FROM games
           LEFT JOIN platforms ON games.platform = platforms.id`
        : 'SELECT * FROM games';

    const params: unknown[] = [];
    const conditions: string[] = [];

    if ($filter) {
      const filterParts = $filter.split(' ');
      if (filterParts[0] === 'platform' && filterParts[1] === 'eq') {
        conditions.push('games.platform = ?');
        params.push(filterParts[2]);
      }
    }

    if ($search) {
      conditions.push('games.name LIKE ?');
      params.push(`%${$search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    try {
      const protocol = request.protocol;
      const hostname = request.hostname;
      const port = request.socket.localPort;

      if ($expand === 'platform') {
        type RawRow = GameRaw & {
          platform_id: number;
          platform_name: string;
          platform_year: number;
        };
        const rows = db.prepare(sql).all(...params) as RawRow[];
        const games: Game[] = rows.map((row) => {
          const platformObj: Platform = {
            id: row.platform_id,
            name: row.platform_name,
            year: row.platform_year,
          };
          return {
            id: row.id,
            name: row.name,
            year: row.year,
            genre: row.genre,
            status: row.status,
            rating: row.rating,
            platform: platformObj,
            href: `${protocol}://${hostname}:${port}/api/games/${row.id}`,
          };
        });
        reply.send({ games });
      } else {
        const rows = db.prepare(sql).all(...params) as GameRaw[];
        const games: GameRaw[] = rows.map((row) => ({
          ...row,
          href: `${protocol}://${hostname}:${port}/api/games/${row.id}`,
        }));
        reply.send({ games });
      }
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });

  fastify.get<{
    Params: { id: string };
    Querystring: GamesListQuery;
    Reply: GameResponse | GameRawResponse | ErrorResponse;
  }>('/games/:id', async (request, reply) => {
    const { id } = request.params;
    const { $expand } = request.query;
    try {
      const protocol = request.protocol;
      const hostname = request.hostname;
      const port = request.socket.localPort;

      if ($expand === 'platform') {
        const sql = `SELECT games.*, platforms.name as platform_name, platforms.year as platform_year, platforms.id as platform_id
                     FROM games
                     LEFT JOIN platforms ON games.platform = platforms.id
                     WHERE games.id = ?`;
        type RawRow = GameRaw & {
          platform_id: number;
          platform_name: string;
          platform_year: number;
        };
        const row = db.prepare(sql).get(id) as RawRow | undefined;
        if (row) {
          const platformObj: Platform = {
            id: row.platform_id ?? (row.platform as unknown as number),
            name: row.platform_name ?? '',
            year: row.platform_year ?? 0,
          };
          const game: Game = {
            id: row.id,
            name: row.name,
            year: row.year,
            genre: row.genre,
            status: row.status,
            rating: row.rating,
            platform: platformObj,
            href: `${protocol}://${hostname}:${port}/api/games/${row.id}`,
          };
          reply.send({ game });
        } else {
          reply.status(404).send({ error: 'Game not found' });
        }
      } else {
        const sql = 'SELECT * FROM games WHERE id = ?';
        const row = db.prepare(sql).get(id) as GameRaw | undefined;
        if (row) {
          const game: GameRaw = {
            ...row,
            href: `${protocol}://${hostname}:${port}/api/games/${row.id}`,
          };
          reply.send({ game });
        } else {
          reply.status(404).send({ error: 'Game not found' });
        }
      }
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });

  fastify.post<{
    Body: CreateGameBody;
    Reply: CreateResponse | ErrorResponse;
  }>('/games', async (request, reply) => {
    const { name, year, platform, genre, status = 'Not Started', rating = null } = request.body;
    const sql =
      'INSERT INTO games (name, year, platform, genre, status, rating) VALUES (?, ?, ?, ?, ?, ?)';
    try {
      const info = db.prepare(sql).run(name, year, platform, genre, status, rating);
      reply.send({ message: 'Game added successfully!', id: Number(info.lastInsertRowid) });
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });

  fastify.put<{
    Params: { id: string };
    Body: UpdateGameBody;
    Reply: UpdateResponse | ErrorResponse;
  }>('/games/:id', async (request, reply) => {
    const { id } = request.params;
    const { name, year, platform, genre, status = 'Not Started', rating = null } = request.body;
    const sql =
      'UPDATE games SET name = ?, year = ?, platform = ?, genre = ?, status = ?, rating = ? WHERE id = ?';
    try {
      db.prepare(sql).run(name, year, platform, genre, status, rating, id);
      reply.send({ message: 'Game updated successfully!' });
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });

  fastify.delete<{
    Params: { id: string };
    Reply: DeleteResponse | ErrorResponse;
  }>('/games/:id', async (request, reply) => {
    const { id } = request.params;
    const sql = 'DELETE FROM games WHERE id = ?';
    try {
      db.prepare(sql).run(id);
      reply.send({ message: 'Game deleted successfully!' });
    } catch (err) {
      reply.status(400).send({ error: (err as Error).message });
    }
  });
}
