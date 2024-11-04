const fastify = require('fastify')({ logger: true });
const sqlite3 = require('sqlite3').verbose();
const cors = require('@fastify/cors');

fastify.register(cors, {
  // put your options here
});

// Connexion à SQLite
const db = new sqlite3.Database('./games.db', (err) => {
  if (err) {
    fastify.log.error(err.message);
  }
  fastify.log.info('Connected to the games SQLite database.');
});

// Création de la table "games" si elle n'existe pas
db.run(
  `CREATE TABLE IF NOT EXISTS games (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     year INTEGER NOT NULL,
     platform TEXT NOT NULL,
     genre TEXT NOT NULL
   )`
);

// Route pour récupérer tous les jeux
fastify.get('/api/games', (request, reply) => {
  const sql = 'SELECT * FROM games';
  db.all(sql, [], (err, rows) => {
    if (err) {
      reply.status(400).send({ error: err.message });
    } else {
      const protocol = request.protocol;
      const hostname = request.hostname;
      const port = request.port;
      rows = rows.map((game) => {
        game.href = `${protocol}://${hostname}:${port}/api/games/${game.id}`;
        return game;
      });
      reply.send({ games: rows });
    }
  });
});

// Route pour récupérer un jeu par son ID
fastify.get('/api/games/:id', (request, reply) => {
  const { id } = request.params;
  const sql = 'SELECT * FROM games WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      reply.status(400).send({ error: err.message });
    } else if (row) {
      // Ajout de l'URL de l'API pour récupérer le jeu
      const protocol = request.protocol;
      const hostname = request.hostname;
      const port = request.port;
      row.href = `${protocol}://${hostname}:${port}/api/games/${row.id}`;
      reply.send({ game: row });
    } else {
      reply.status(404).send({ error: 'Game not found' });
    }
  });
});

// Route pour ajouter un nouveau jeu
fastify.post('/api/games', (request, reply) => {
  const { name, year, platform, genre } = request.body;
  const sql = 'INSERT INTO games (name, year, platform, genre) VALUES (?, ?, ?, ?)';

  // Utilisation de `db.run` sans RETURNING
  db.run(sql, [name, year, platform, genre], function (err) {
    if (err) {
      // Gestion des erreurs
      reply.status(400).send({ error: err.message });
    } else {
      // `this.lastID` pour récupérer l'ID de la dernière ligne insérée
      reply.send({ message: 'Game added successfully!', id: this.lastID });
    }
  });
});

// Route pour supprimer un jeu
fastify.delete('/api/games/:id', (request, reply) => {
  const { id } = request.params;
  const sql = 'DELETE FROM games WHERE id = ?';
  db.run(sql, id, (err) => {
    if (err) {
      reply.status(400).send({ error: err.message });
    } else {
      reply.send({ message: 'Game deleted successfully!' });
    }
  });
});

// Route pour modifier un jeu
fastify.put('/api/games/:id', (request, reply) => {
  const { id } = request.params;
  const { name, year, platform, genre } = request.body;
  const sql = 'UPDATE games SET name = ?, year = ?, platform = ?, genre = ? WHERE id = ?';
  db.run(sql, [name, year, platform, genre, id], (err) => {
    if (err) {
      reply.status(400).send({ error: err.message });
    } else {
      reply.send({ message: 'Game updated successfully!' });
    }
  });
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