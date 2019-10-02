const express = require('express');
const service = require('../service/userService');
const router = express.Router();


//REGISTER API
router.post('/register', (req, res, next) => {
    return service.registerUser(req.body).then(responseData => {
        res.json({ data: responseData });
    }).catch(err => {
        next(err);
    })
})

//LOGIN API
router.post('/login', (req, res, next) => {
    var uEmail = req.body.uEmail;
    var uPass = req.body.uPass;
    return service.loginUser(uEmail, uPass).then(item => {
        res.json({ data: item });
    }).catch(err => {
        next(err);
    });
})

//SENDMESSAGE API
router.post('/sendMessage', (req, res, next) => {
    var fromEmail = req.body.from;
    var toEmail = req.body.to;
    var msgBody = req.body.msgBody;
    return service.addMessage(fromEmail, toEmail, msgBody).then(item => {
        res.json({ data: item, message: "Message Sent!" });
    }).catch(err => {
        next(err);
    });
})

//GETMESSAGES API
router.get('/getMessages/:from/:to', (req, res, next) => {
    var fromEmail = req.params.from;
    var toEmail = req.params.to;
    return service.getChatMessages(fromEmail, toEmail).then(item => {
        res.json({ data: item });
    }).catch(err => {
        next(err);
    });
})

module.exports = router;