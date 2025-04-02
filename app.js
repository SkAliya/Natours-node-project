const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const toursRouter = require(`${__dirname}/routes/toursRoutes`);
const usersRouter = require(`${__dirname}/routes/usersRoutes`);

const app = express();

// MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// STATIC FILES LOADING liek html overview html images css js files like . USING STATIC middle
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hii im from middleware');
  next();
});

app.use((req, res, next) => {
  console.log('hii im from middleware2');
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES FUNCTIONS
/////////////////////////////////////////////////////////

// ROUTING
// MOUNTING MULTIPLE ROUTES USING EXPRESS ROUTER JUT CHANGING SOME CODE ALL SAME WORKS

// TOURS ROUTEING
app.use('/api/v1/tours', toursRouter);

// USERS ROUTING
app.use('/api/v1/users', usersRouter);

module.exports = app;
