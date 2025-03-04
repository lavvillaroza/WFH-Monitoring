const fs = require('fs');
const https = require('https');
const path = require('path');
const next = require('next');

// Define the Next.js app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Generate or load a self-signed certificate
const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
};

// Start the Next.js server
app.prepare().then(() => {
  https
    .createServer(options, (req, res) => {
      handle(req, res);
    })
    .listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on https://10.170.0.148:3000');
    });
});
