const functions = require('firebase-functions');
const express = require('express');
const app = express();
const firebase = require('firebase');
const { db } = require('./util/admin');


 exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });
const { getAllScreams ,postOneScream ,getScream ,commentOnScream ,likeScream ,unlikeScream ,deleteScream} =  require('./handlers/screams');
const { signup ,login ,uploadImage ,addUserDetails ,getAuthenticatedUser ,getUserDetails ,markNotificationsRead} = require('./handlers/users');
const FBAuth = require('./util/fbAuth');

//scream routes
app.get('/screams' ,getAllScreams);
//crearte a scream
app.post('/screams' ,FBAuth ,postOneScream);
app.get('/screams/:screamId' ,getScream);
app.post('/screams/:screamId/comment',FBAuth ,commentOnScream);
app.get('/screams/:screamId/like',FBAuth ,likeScream);
app.get('/screams/:screamId/unlike' ,FBAuth,unlikeScream);
app.delete('/screams/:screamId',FBAuth ,deleteScream);


//TODO: delete scream ,like scream ,unlike scream ,comments scream


//users route.jaa ke dekh handlers/users.js me
app.post('/signup',signup);
app.post('/login' ,login);
app.post('/user/image', FBAuth ,uploadImage);
app.post('/user' , FBAuth ,addUserDetails);
app.get('/user' , FBAuth ,getAuthenticatedUser);
app.get('/user/:handle' ,getUserDetails);
app.post('/notifications' ,FBAuth ,markNotificationsRead);

exports.api = functions.region('us-central1').https.onRequest(app);

exports.createNotificationOnLike = functions
  .region('us-central1')
  .firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });


  exports.deleteNotificationOnUnLike = functions
  .region('us-central1')
  .firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

  exports.createNotificationOnComment = functions
  .region('us-central1')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });


  exports.onUserImageChange = functions
  .region('us-central1')
  .firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('screams')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onScreamDelete = functions
  .region('us-central1')
  .firestore.document('/screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('screamId', '==', screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection('likes')
          .where('screamId', '==', screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('screamId', '==', screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
//4:23:46