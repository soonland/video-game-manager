import path from 'path';

import Database from 'better-sqlite3';

const db = new Database(path.join(__dirname, '..', 'games.db'));

db.exec(`CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  platform INTEGER NOT NULL,
  genre TEXT NOT NULL
)`);

const gameCols = (db.pragma('table_info(games)') as { name: string }[]).map((c) => c.name);
if (!gameCols.includes('status'))
  db.exec("ALTER TABLE games ADD COLUMN status TEXT NOT NULL DEFAULT 'Not Started'");
if (!gameCols.includes('rating')) db.exec('ALTER TABLE games ADD COLUMN rating INTEGER');

db.exec(`CREATE TABLE IF NOT EXISTS platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  year INTEGER NOT NULL
)`);

export default db;
