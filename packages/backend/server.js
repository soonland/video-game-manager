const fastify = require('fastify')({ logger: true });
const Database = require('better-sqlite3');
const cors = require('@fastify/cors');

fastify.register(cors, {
  // put your options here
});

// Connexion à SQLite
const db = new Database('./games.db');
fastify.log.info('Connected to the games SQLite database.');

// Création de la table "games" si elle n'existe pas
db.exec(`CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  platform INTEGER NOT NULL,
  genre TEXT NOT NULL
)`);
// Création de la table "platforms" si elle n'existe pas
db.exec(`CREATE TABLE IF NOT EXISTS platforms (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL,
   year INTEGER NOT NULL
)`);

// Route pour récupérer tous les jeux
fastify.get('/api/games', (request, reply) => {
  const { $expand, $filter, $search } = request.query;
  let sql = $expand === 'platform'
    ? `SELECT games.*, platforms.name as platform_name, platforms.year as platform_year, platforms.id as platform_id
       FROM games
       LEFT JOIN platforms ON games.platform = platforms.id`
    : 'SELECT * FROM games';

  const params = [];
  const conditions = [];

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
    const rows = db.prepare(sql).all(...params);
    const protocol = request.protocol;
    const hostname = request.hostname;
    const port = request.port;
    const games = rows.map((game) => {
      game.href = `${protocol}://${hostname}:${port}/api/games/${game.id}`;
      if ($expand === 'platform') {
        game.platform = {
          id: game.platform_id,
          name: game.platform_name,
          year: game.platform_year,
        };
        delete game.platform_id;
        delete game.platform_name;
        delete game.platform_year;
      }
      return game;
    });
    reply.send({ games });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Route pour récupérer un jeu par son ID
fastify.get('/api/games/:id', (request, reply) => {
  const { id } = request.params;
  const sql = 'SELECT * FROM games WHERE id = ?';
  try {
    const row = db.prepare(sql).get(id);
    if (row) {
      const protocol = request.protocol;
      const hostname = request.hostname;
      const port = request.port;
      row.href = `${protocol}://${hostname}:${port}/api/games/${row.id}`;

      // Récupérer l'objet représentant la console
      const platformSql = 'SELECT * FROM platforms WHERE id = ?';
      const platformRow = db.prepare(platformSql).get(row.platform);
      row.platform = platformRow;
      reply.send({ game: row });
    } else {
      reply.status(404).send({ error: 'Game not found' });
    }
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Route pour ajouter un nouveau jeu
fastify.post('/api/games', (request, reply) => {
  const { name, year, platform, genre } = request.body;
  const sql = 'INSERT INTO games (name, year, platform, genre) VALUES (?, ?, ?, ?)';

  try {
    const stmt = db.prepare(sql);
    const info = stmt.run(name, year, platform, genre);
    reply.send({ message: 'Game added successfully!', id: info.lastInsertRowid });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Route pour supprimer un jeu
fastify.delete('/api/games/:id', (request, reply) => {
  const { id } = request.params;
  const sql = 'DELETE FROM games WHERE id = ?';
  try {
    const stmt = db.prepare(sql);
    stmt.run(id);
    reply.send({ message: 'Game deleted successfully!' });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Route pour modifier un jeu
fastify.put('/api/games/:id', (request, reply) => {
  const { id } = request.params;
  const { name, year, platform, genre } = request.body;
  const sql = 'UPDATE games SET name = ?, year = ?, platform = ?, genre = ? WHERE id = ?';
  try {
    const stmt = db.prepare(sql);
    stmt.run(name, year, platform, genre, id);
    reply.send({ message: 'Game updated successfully!' });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Route pour récupérer toutes les plateformes
fastify.get('/api/platforms', (request, reply) => {
  const sql = 'SELECT * FROM platforms';
  try {
    let rows = db.prepare(sql).all();
    const protocol = request.protocol;
    const hostname = request.hostname;
    const port = request.port;
    rows = rows.map((platform) => {
      platform.href = `${protocol}://${hostname}:${port}/api/platforms/${platform.id}`;
      return platform;
    });
    reply.send({ platforms: rows });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Route pour récupérer une plateforme par son ID
fastify.get('/api/platforms/:id', (request, reply) => {
  const { id } = request.params;
  const sql = 'SELECT * FROM platforms WHERE id = ?';
  try {
    const row = db.prepare(sql).get(id);
    if (row) {
      const protocol = request.protocol;
      const hostname = request.hostname;
      const port = request.port;
      row.href = `${protocol}://${hostname}:${port}/api/platforms/${row.id}`;
      reply.send({ platform: row });
    } else {
      reply.status(404).send({ error: 'Platform not found' });
    }
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Route pour ajouter une nouvelle plateforme
fastify.post('/api/platforms', (request, reply) => {
  const { name, year } = request.body;
  const sql = 'INSERT INTO platforms (name, year) VALUES (?, ?)';

  try {
    const stmt = db.prepare(sql);
    const info = stmt.run(name, year);
    reply.send({ message: 'Platform added successfully!', id: info.lastInsertRowid });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Route pour supprimer une plateforme
fastify.delete('/api/platforms/:id', (request, reply) => {
  const { id } = request.params;
  const sql = 'DELETE FROM platforms WHERE id = ?';
  try {
    const stmt = db.prepare(sql);
    stmt.run(id);
    reply.send({ message: 'Platform deleted successfully!' });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Route pour modifier une plateforme
fastify.put('/api/platforms/:id', (request, reply) => {
  const { id } = request.params;
  const { name, year } = request.body;
  const sql = 'UPDATE platforms SET name = ?, year = ? WHERE id = ?';
  try {
    const stmt = db.prepare(sql);
    stmt.run(name, year, id);
    reply.send({ message: 'Platform updated successfully!' });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Démarrer le serveur Fastify
const start = async () => {
  try {
    await fastify.listen({ port: 5000 });
    fastify.log.info(`Server running on http://localhost:5000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();