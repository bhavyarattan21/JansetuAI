import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function localJsonDbPlugin() {
  const dataDir = path.resolve(__dirname, 'data');
  const usersFile = path.join(dataDir, 'users.json');
  const grievancesFile = path.join(dataDir, 'grievances.json');

  const ensureFiles = () => {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]', 'utf-8');
    if (!fs.existsSync(grievancesFile)) fs.writeFileSync(grievancesFile, '[]', 'utf-8');
  };

  return {
    name: 'local-json-db',
    configureServer(server) {
      ensureFiles();

      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/users' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          return res.end(fs.readFileSync(usersFile, 'utf-8'));
        }

        if (req.url === '/api/users' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const userObj = JSON.parse(body);
              let users = JSON.parse(fs.readFileSync(usersFile, 'utf-8') || '[]');
              const idx = users.findIndex(u => u.email === userObj.email);
              if (idx >= 0) {
                users[idx] = { ...users[idx], ...userObj, lastSeen: new Date().toLocaleString() };
              } else {
                users.push({ ...userObj, firstSeen: new Date().toLocaleString(), lastSeen: new Date().toLocaleString() });
              }
              fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, count: users.length }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/grievances' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          return res.end(fs.readFileSync(grievancesFile, 'utf-8'));
        }

        if (req.url === '/api/grievances' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              let list = Array.isArray(payload) ? payload : [payload];
              fs.writeFileSync(grievancesFile, JSON.stringify(list, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, count: list.length }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localJsonDbPlugin()]
});
