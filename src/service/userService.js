const dbLayer = require('../model/user');
const validator = require('../utilities/validator');
let user = {}

user.registerUser = (userData) => {
    //Validators for Field Validations
    validator.validateName(userData.uProfile.uName);
    validator.validatePhone(userData.uProfile.uPhone);
    validator.validateEmail(userData.uCredentials.uEmail);
    validator.validatePassword(userData.uCredentials.uPass);
    //Encryption for storing Passwords
    const sha256 = require('js-sha256').sha256;
    const salt = sha256(Math.floor(Math.random() * 100000000).toString()).substring(0, 9);
    const password = sha256(salt + sha256(salt + sha256(userData.uCredentials.uPass)));
    userData.uCredentials.salt = salt;
    userData.uCredentials.uPass = password;
    
    return dbLayer.registerUser(userData).then(response => {
        if (response)
            return response;
        else {
            let err = new Error('Registration Failed');
            err.status = 500;
            throw err;
        }
    })
}

user.loginUser = (uEmail, pass) => {
    validator.validateEmail(uEmail);
    validator.validatePassword(pass);
    return dbLayer.userLogin(uEmail, pass).then(response => {
        if (response)
            return response;
        else {
            let err = new Error('Login Failed');
            err.status = 500;
            throw err;
        }
    })
}

user.addMessage = (from, to, message) => {
    return dbLayer.addMessage(from, to, message).then(response => {
        if (response)
            return response.msgBody;
        else {
            let err = new Error('Failed to Save Message');
            err.status = 500;
            throw err;
        }
    })
}

user.getChatMessages = (from, to) => {
    return dbLayer.getChatMessages(from, to).then(response => {
        if (response)
            return response;
        else {
            let err = new Error('No Messages Found');
            err.status = 500;
            throw err;
        }
    })
}

user.getFriends = (email) => {
    return dbLayer.getFriends(email).then(response=>{
        if(response.length)
        return response;
        else {
            let err = new Error('No Friends Found');
            err.status = 500;
            throw err;
        }
    })
}

module.exports = user;