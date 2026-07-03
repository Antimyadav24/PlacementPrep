const fs = require('fs');
const dbPath = 'db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (!db.users) db.users = [];
if (!db.announcements) db.announcements = [];
if (!db['interview-resources']) db['interview-resources'] = [];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Admin endpoints added to db.json');
