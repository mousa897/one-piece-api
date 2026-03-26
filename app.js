const express = require('express');
const app = express();
const morgan = require('morgan');
const characterRouter = require('./routes/characterRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

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

// Error handling
app.all('*splat', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
