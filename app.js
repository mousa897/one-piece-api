const express = require('express');
const app = express();
const morgan = require('morgan');
const characterRouter = require('./routes/characterRoutes');

// 1) MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('query parser', 'extended');

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/characters', characterRouter);

module.exports = app;
