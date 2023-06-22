const express = require('express');
const session = require('express-session');
const helmet = require('helmet');

const passport = require('./passportHandler');
const router = require('./router');

const app = express();
app.engine('html', require('ejs').renderFile);

// const { errorHandler } = require('./server/v1/middlewares');

// Augment URLs and add security
app.use(express.urlencoded({
  extended: true,
}));
app.use(helmet());

// Not sure
app.use(express.json({ limit: '15mb' }));

// Sessions
var SQLiteStore = require('connect-sqlite3')(session);
app.use(session({
  secret: 'grupo onyx azure',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db' })
}));
app.use(passport.authenticate('session'));

// Setup SAML SSO handler
// app.use(passport.initialize());
// app.use(passport.session());

//= ==========Registering Router==========
app.use('/', router);

//= ======ERROR Handler
// app.use(errorHandler);


module.exports = app;
