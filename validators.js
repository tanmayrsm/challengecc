const isEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.match(regex)){
        return true;
    }else{
        return false;
    }
}
const isEmpty = (string) => {
    if(string.trim() === '')    return true;
    else return false;
}


exports.validateSignUpData = (data) => {
    let errors = {};
    //pehle data => newUser tha
    if(isEmpty(data.email)){
        errors.email = "Email is empty re";
    }else if(!isEmail(data.email)){
        errors.email = "Must be a valid email";
    }
    if(isEmpty(data.password)){
        errors.password = "Password empty ?";
    }
    if(data.password !== data.confirmPassword) errors.confirmPassword = "Passwords don't match";

    if(isEmpty(data.handle)) errors.handle = "Handles should not match";

    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true :false
    }
}

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = "Email empty ?";
    if(isEmpty(data.password)) errors.password = "Password empty ?";
    
    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true :false
    }
}

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.bio.trim()))   userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())){
        //ram.com  => http://ram.com
        if(data.website.trim().substring(0,4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`;
        }else   userDetails.website = data.website;
    }
    if(!isEmpty(data.location.trim()))   userDetails.location = data.location;

    return userDetails;
}