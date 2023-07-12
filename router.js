const express = require('express');
const router = express.Router();

const useragent = require('useragent');
const Saml2js = require('saml2js');

const passport = require('./passportHandler.js');

// const {
//   userLogin,
// } = require('./../../controller');

router.get('/login', (req, res) => {
  // res.writeHead(200);
  res.set('Content-Security-Policy', `form-action https://onyx.dartbuilt.com:5500/login/sso ${process.env.SSO_ENTRYPOINT}`);
  res.render('login.html');
  // res.end('Login page');
});

router.get('/login/failed', (req, res) => {
  res.writeHead(200);
  res.end('Login failed on callback.');
});

/**
 * This Route Authenticates req with IDP
 * If Session is active it returns saml response
 * If Session is not active it redirects to IDP's login form
 */
router.get('/login/sso', passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

const userAgentHandler = (req, res, next) => {
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceInfo = Object.assign({}, {
    device: agent.device,
    os: agent.os,
  });
  req.device = deviceInfo;
  next();
};

const userExtractor = (req, res, next) => {
  const xmlResponse = req.body.SAMLResponse;
  const parser = new Saml2js(xmlResponse);
  req.samlUserObject = parser.toObject();
  next();
};

const responseHandler = (req, res) => {
  console.log('Logged in.');
  console.log('User:');
  console.log(req.user);
  console.log('SAML User Obj:');
  console.log(req.samlUserObject);
  // userLogin.createUserSession(res, req));

  res.redirect('/');
};

/**
 * This is the callback URL
 * Once Identity Provider validated the Credentials it will be called with base64 SAML req body
 * Here we used Saml2js to extract user Information from SAML assertion attributes
 * If every thing validated we validates if user email present into user DB.
 * Then creates a session for the user set in cookies and do a redirect to Application
 */
router.post('/login/sso/callback',
  userAgentHandler,
  passport.authenticate('saml', {
    failureRedirect: '/login/failed',
  }),
  userExtractor,
  responseHandler
);

router.get('/', (req, res) => {
  // console.log(req);
  // res.writeHead(200);

  res.render('index.html', {
    user: req.user
  });

  console.log("Homepage.");
});

module.exports = router;
