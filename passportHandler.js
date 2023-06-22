const passport = require('passport');
const passportSaml = require('passport-saml');
require('dotenv').config();

passport.serializeUser((user, done) => {
  console.log('Serializing user');
  console.log(user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserializing user');
  done(null, user);
});

// SAML strategy for passport -- Single IPD
const strategy = new passportSaml.Strategy({
    entryPoint: process.env.SSO_ENTRYPOINT,
    // entryPoint: 'https://login.microsoftonline.com/4bfb33bf-5456-462e-8628-2bc64f16a0bd/saml2',
    issuer: process.env.SSO_ISSUER,
    // issuer: 'uncierre.com',
    callbackUrl: process.env.SSO_CALLBACK_URL,
    //callbackUrl: 'localhost:3500/login/sso/callback',
    cert: process.env.SSO_CERT,
    //cert: 'MIIC8DCCAdigAwIBAgIQFHDLcPh9pZBCoiXtv85miDANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yMjEwMjcxNDI1MDRaFw0yNTEwMjcxNDI1MDRaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqcpEuaTVauruZUNFHBl1iK+TZtKpT0hn0G2iJHY1P4h59f+Zu2Y3Y37a+jsVTOjDXZt/Ip+QYnAsV+fq1Yc8tnNPnQSM3cU2RwJmtBzBqLyCYEhMnXIWTzw5duleBrlbsWLhlbKisyDhEBnOCh/rDnN0JCQlFF/DH1xSEpyoakiDlJ+nRYk2ASS0mPaRORepLS03lxmR5LGiMPye+dTqIZy64XSgNyoge4KZG+BGCO6OZ/ilNHA0BITY8mgXFGNn6dOxEsw75ba7JXRmWgxPxPNapm9E7OdurGFTH+oS/J2CNV8cjlgccTZAuiu6ic5eDmgna9bncLkzKOna3/QdXQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQB1LBk7u7w6RYAUMOLVFuGsvAd2fk9lc+fDIZJMj3PXOai4xqhsaTFYRfJLb8GwRnfm71vuoigOZjFpW91xF9zn7oRD0KAiH+EVKTehdPL+XrWFDdlVQpN9W8rct4zT/W+1HqNEXyMTEA+NtrXSJwg4MBRQ//7fBDmnIuJHHFMql6wDW/qu/sNniXZVIcFyW1urmozsHzheQXoyYKdGP4YpC7UwUgDrwOF2IeQ3quUnam/8PFCFIL+QG/uWNnZ0scPP4twta88+rKYZLSZH9JUnYjvVz505myoovUhUU0iXt8ClWHLDlwVFJ4sWd/nwL/ZUYuIKe16KypGvLjQVjrAl'
  },
  (profile, done) => {
    console.log('Strategy done.');
    // console.log(profile);
    console.log(profile.nameID);
    console.log(profile['http://schemas.microsoft.com/identity/claims/displayname']);
    console.log(profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']);
    console.log(profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
    done(null, profile);
  }
);

passport.use(strategy);

module.exports = passport;
