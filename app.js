require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const apiV1Router = require('./routes/api-v1');

const app = express();
const corsOptions = {
  origin: process.env.API_CORS_ORIGIN.split(',')
}
//cors
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

/**
 * api v1 router
 */
app.use('/api/v1', cors(corsOptions), apiV1Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  switch(err.status){
    case 401:
      return res.status(401).send('Unauthorized');
    case 404:
      if (req.accepts('json')) {
        return res.status(404).json(err);
      }
      return res.status(404).render('404');
    default:
      if (req.accepts('json')) {
        return res.status(500).json(err);
      }
      return res.status(500).render(err);
  }
});

module.exports = app;
