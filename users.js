const { db,admin } = require('../util/admin');
const firebase = require('firebase');
const config = require('../util/config');
const { validateSignUpData ,validateLoginData } = require('../util/validators'); 

firebase.initializeApp(config);

exports.signup = (req,res) => {
    const newUser = {
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword,
        handle : req.body.handle,
    };

    const { valid, errors } = validateSignUpData(newUser);

    if(!valid)  return res.status(400).json(errors);

    const noImg = 'pic.png';
    
    //TODO validate data
    let userId ,token;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ handle : 'this handle already taken re' });
            } else{
                return firebase.auth().createUserWithEmailAndPassword(newUser.email , newUser.password);            
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle : newUser.handle,
                email : newUser.email,
                createdAt : new Date().toISOString(),
                imageUrl : `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId : userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch(err => {
            console.error(err);

            if(err.code == 'auth/email-already-in-use'){
                return res.status(400).json({
                    email : `Email already in use`
                })    
            } else{
            return res.status(500).json({
                message : `Error of system`
            })  
        }
    });
}

exports.login = (req ,res) => {
    const user = {
        email : req.body.email,
        password : req.body.password
    };

    const { valid, errors } = validateLoginData(user);

    if(!valid)  return res.status(400).json(errors);

    
    firebase.auth().signInWithEmailAndPassword(user.email , user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({ token });
    })
    .catch((err) => {
        console.error(err);
        if(err.code == 'auth/wrong-password' || err.code == 'auth/user-not-found'){
            return res.status(403).json({ general : 'wrong credentials' });    
        }
        else
            return res.status(500).json({ err : err.code });
    });
}

exports.uploadImage = (req,res) => {
    const Busboy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    
    const busboy = new Busboy({ headers: req.headers });

    let imageFileName;
    let imageToBeUpLoaded = {};

    busboy.on('file' , (fieldname , file , filename , encoding , mimetype) => {
        if(mimetype !== 'image/png' && mimetype !== 'jpeg'){
            return res.status(400).json({ error : 'Wrong file type submitted' });
        }
        console.log(fieldname + "filename:" + filename + " mimetype: " + mimetype);
        //my.image.png
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        //49388397893545.png
        imageFileName = `${ Math.round(Math.random() * 100000000000000) }.${ imageExtension }`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUpLoaded = { filepath, mimetype };

        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish' ,() => {
        admin.storage().bucket().upload(imageToBeUpLoaded.filepath, {
            resumable : false,
            metadata : {
                metadata : {
                    contentType : imageToBeUpLoaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${ req.user.handle }`).update({ imageUrl });
        })
        .then(() => {
            return res.json({ message : 'Image uploaded successfully' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error : err.code });
        });
    });
    busboy.end(req.rawBody);
}