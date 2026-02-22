import db from './db';

// Clear existing data
db.exec('DELETE FROM games');
db.exec('DELETE FROM platforms');
db.exec("DELETE FROM sqlite_sequence WHERE name='games'");
db.exec("DELETE FROM sqlite_sequence WHERE name='platforms'");

// Platforms
const insertPlatform = db.prepare('INSERT INTO platforms (name, year) VALUES (?, ?)');

const platforms = [
  { name: 'NES', year: 1983 },
  { name: 'Super Nintendo', year: 1990 },
  { name: 'Nintendo 64', year: 1996 },
  { name: 'GameCube', year: 2001 },
  { name: 'Wii', year: 2006 },
  { name: 'Nintendo Switch', year: 2017 },
  { name: 'PlayStation', year: 1994 },
  { name: 'PlayStation 2', year: 2000 },
  { name: 'PlayStation 3', year: 2006 },
  { name: 'PlayStation 4', year: 2013 },
  { name: 'PlayStation 5', year: 2020 },
  { name: 'Xbox', year: 2001 },
  { name: 'Xbox 360', year: 2005 },
  { name: 'Xbox One', year: 2013 },
  { name: 'Xbox Series X|S', year: 2020 },
  { name: 'PC', year: 1981 },
];

const platformIds: Record<string, number> = {};
for (const p of platforms) {
  const result = insertPlatform.run(p.name, p.year);
  platformIds[p.name] = Number(result.lastInsertRowid);
}

// Games
const insertGame = db.prepare(
  'INSERT INTO games (name, year, platform, genre, status, rating) VALUES (?, ?, ?, ?, ?, ?)',
);

const games = [
  // Action
  { name: 'Super Mario Bros.', year: 1985, platform: 'NES', genre: 'Action', status: 'Completed', rating: 5 },
  { name: 'Super Mario Bros. 3', year: 1988, platform: 'NES', genre: 'Action', status: 'Completed', rating: 5 },
  { name: 'Super Mario World', year: 1990, platform: 'Super Nintendo', genre: 'Action', status: 'Completed', rating: 5 },
  { name: 'Super Mario 64', year: 1996, platform: 'Nintendo 64', genre: 'Action', status: 'Completed', rating: 5 },
  { name: 'Super Mario Odyssey', year: 2017, platform: 'Nintendo Switch', genre: 'Action', status: 'Playing', rating: 4 },
  { name: 'God of War', year: 2018, platform: 'PlayStation 4', genre: 'Action', status: 'Completed', rating: 5 },
  { name: 'God of War Ragnarök', year: 2022, platform: 'PlayStation 5', genre: 'Action', status: 'Playing', rating: null },
  { name: 'Halo: Combat Evolved', year: 2001, platform: 'Xbox', genre: 'Action', status: 'Completed', rating: 4 },
  { name: 'Halo 3', year: 2007, platform: 'Xbox 360', genre: 'Action', status: 'Completed', rating: 4 },
  { name: 'Halo Infinite', year: 2021, platform: 'Xbox Series X|S', genre: 'Action', status: 'Dropped', rating: 2 },
  // Aventure
  { name: 'The Legend of Zelda: Ocarina of Time', year: 1998, platform: 'Nintendo 64', genre: 'Aventure', status: 'Completed', rating: 5 },
  { name: 'The Legend of Zelda: Breath of the Wild', year: 2017, platform: 'Nintendo Switch', genre: 'Aventure', status: 'Completed', rating: 5 },
  { name: 'The Legend of Zelda: Tears of the Kingdom', year: 2023, platform: 'Nintendo Switch', genre: 'Aventure', status: 'Playing', rating: null },
  { name: "Uncharted 4: A Thief's End", year: 2016, platform: 'PlayStation 4', genre: 'Aventure', status: 'Completed', rating: 4 },
  { name: 'Red Dead Redemption 2', year: 2018, platform: 'PlayStation 4', genre: 'Aventure', status: 'Completed', rating: 5 },
  { name: "Assassin's Creed IV: Black Flag", year: 2013, platform: 'Xbox One', genre: 'Aventure', status: 'Dropped', rating: 3 },
  // RPG
  { name: 'Final Fantasy VII', year: 1997, platform: 'PlayStation', genre: 'RPG', status: 'Completed', rating: 5 },
  { name: 'Final Fantasy X', year: 2001, platform: 'PlayStation 2', genre: 'RPG', status: 'Completed', rating: 4 },
  { name: 'Final Fantasy XVI', year: 2023, platform: 'PlayStation 5', genre: 'RPG', status: 'Not Started', rating: null },
  { name: 'The Witcher 3: Wild Hunt', year: 2015, platform: 'PlayStation 4', genre: 'RPG', status: 'Completed', rating: 5 },
  { name: 'Elden Ring', year: 2022, platform: 'PlayStation 5', genre: 'RPG', status: 'Playing', rating: null },
  { name: "Baldur's Gate 3", year: 2023, platform: 'PC', genre: 'RPG', status: 'Playing', rating: 5 },
  { name: 'Mass Effect 2', year: 2010, platform: 'Xbox 360', genre: 'RPG', status: 'Completed', rating: 5 },
  { name: 'The Elder Scrolls V: Skyrim', year: 2011, platform: 'Xbox 360', genre: 'RPG', status: 'Completed', rating: 4 },
  // Simulation
  { name: 'The Sims 4', year: 2014, platform: 'PC', genre: 'Simulation', status: 'Dropped', rating: 2 },
  { name: 'Cities: Skylines', year: 2015, platform: 'PC', genre: 'Simulation', status: 'Not Started', rating: null },
  { name: 'Animal Crossing: New Horizons', year: 2020, platform: 'Nintendo Switch', genre: 'Simulation', status: 'Completed', rating: 4 },
  { name: 'Stardew Valley', year: 2016, platform: 'PC', genre: 'Simulation', status: 'Completed', rating: 5 },
  // Stratégie
  { name: 'StarCraft II', year: 2010, platform: 'PC', genre: 'Stratégie', status: 'Not Started', rating: null },
  { name: 'Civilization VI', year: 2016, platform: 'PC', genre: 'Stratégie', status: 'Playing', rating: 4 },
  { name: 'XCOM 2', year: 2016, platform: 'PC', genre: 'Stratégie', status: 'Completed', rating: 4 },
  { name: 'Age of Empires IV', year: 2021, platform: 'PC', genre: 'Stratégie', status: 'Not Started', rating: null },
  // Sport
  { name: 'FIFA 23', year: 2022, platform: 'PlayStation 5', genre: 'Sport', status: 'Dropped', rating: 2 },
  { name: 'NBA 2K24', year: 2023, platform: 'PlayStation 5', genre: 'Sport', status: 'Not Started', rating: null },
  { name: "Tony Hawk's Pro Skater 1+2", year: 2020, platform: 'Xbox One', genre: 'Sport', status: 'Completed', rating: 5 },
  { name: 'Wii Sports', year: 2006, platform: 'Wii', genre: 'Sport', status: 'Completed', rating: 4 },
];

for (const g of games) {
  insertGame.run(g.name, g.year, platformIds[g.platform], g.genre, g.status, g.rating);
}

console.log(`✓ Seeded ${platforms.length} platforms and ${games.length} games`);
