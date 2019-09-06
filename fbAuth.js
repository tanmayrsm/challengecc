const { admin ,db } = require('./admin')

module.exports = (req ,res ,next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    }else{
        console.error('No token found to create a post');
        return res.status(403).json({ error : 'Unautorized' });
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
       //decode kar token ko and take required info --> user waale scream se
       req.user = decodedToken;
       //console.log(decodedToken);
       return db.collection('users')
       .where('userId', '==' ,req.user.uid)
       .limit(1)
       .get();
    })
    .then(data => {
       req.user.handle = data.docs[0].data().handle;
       return next();
       //next means --> chal ab post request pe jaa
    })
    .catch(error => {
        console.error('Error while verifying token');
        res.status(403).json(error);
    });
}



    


