const functions = require('firebase-functions');
const express = require('express');
const app = express();
const firebase = require('firebase');



 exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });
const { getAllScreams ,postOneScream} =  require('./handlers/screams');
const { signup ,login ,uploadImage} = require('./handlers/users');
const FBAuth = require('./util/fbAuth');

//scream routes
app.get('/screams' ,getAllScreams);
//crearte a scream
app.post('/screams' ,FBAuth ,postOneScream);

//users route.jaa ke dekh handlers/users.js me
app.post('/signup',signup);
app.post('/login' ,login);
app.post('/user/image',FBAuth ,uploadImage);

exports.api = functions.region('us-central1').https.onRequest(app);

//2.13.46