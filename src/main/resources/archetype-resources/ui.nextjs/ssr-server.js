const express = require('express');
const next = require('next');

const bodyParser = require('body-parser');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(bodyParser.json());

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.post('/*', (req, res) => {
      req.method = 'GET';
      return app.render(req, res, '/');
    });

    server.listen(4200, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:4200');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
