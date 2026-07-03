const fs = require('fs');
const dbPath = 'db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (!db.bookmarks) db.bookmarks = [];
if (!db.results) db.results = [];
if (!db['study-materials']) db['study-materials'] = [];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Endpoints added to db.json');
