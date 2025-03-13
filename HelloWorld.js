require('dotenv').config();
const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const path = require('path');
const morgan = require('morgan');

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const serve = serveStatic(path.join(__dirname, 'www'));
const logger = morgan('combined');

const server = http.createServer((req, res) => {
  logger(req, res, (err) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    serve(req, res, (err) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      finalhandler(req, res)(err);
    });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});