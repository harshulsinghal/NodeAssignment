const collection = require('../utilities/connection');
const sha256 = require('js-sha256').sha256;
let user = {}


//GenerateID function for denerating unique UserId
user.generateId = () => {
    return collection.getCollection().then((model) => {
        return model.aggregate([{
            $project: {
                "userId": 1,
                _id: 0
            }
        },
        {
            $sort: {
                "userId": -1
            }
        }, {
            $limit: 1
        }]).then((ids) => {
            let uId;
            if (ids.length > 0) {
                uId = Number(ids[0].userId.substr(1, ids[0].userId.length));
                uId += 1;
            } else {
                uId = 1000;
            }
            return String('U') + uId;
        })
    })
}

//function to find if user exists or not
user.findUser = (uEmail) => {
    return collection.getCollection().then(userColl => {
        return userColl.find({ "uCredentials.uEmail": uEmail }).then(data => {
            return data;
        })
    })
}


//function to execute registration
user.registerUser = (userData) => {
    return collection.getCollection().then(userColl => {
        return user.findUser(userData.uCredentials.uEmail).then(data => {
            if (data.length === 0) {
                return user.generateId().then(uid => {
                    userData.userId = uid;
                    return userColl.create(userData).then(insertedData => {
                        return { userId: insertedData.userId, uName: insertedData.uProfile.uName };
                    })
                })
            } else {
                throw new Error('User with this E-mail is already Registered. Please login.')
            }
        })
    })
}

//function to execute login
user.userLogin = (uEmail, uPass) => {
    return collection.getCollection().then(userColl => {
        return user.findUser(uEmail).then(data => {
            if (data.length === 1) {
                //Password comparison
                const salt = data[0]['uCredentials']['salt'];
                uPass = sha256(salt + sha256(salt + sha256(uPass)));

                if (uPass == data[0]['uCredentials']['uPass']) {
                    return userColl.updateOne({ "uCredentials.uEmail": uEmail }, { $set: { "uProfile.uLastLogin": new Date().toISOString() } }).then(res => {
                        if (res.nModified === 1) {
                            return data[0].uProfile;
                        }
                    })
                } else {
                    throw new Error("The password entered is incorrect!!")
                }
            } else {
                throw new Error("You are not registered. Please register to login");
            }
        })
    })
}

//function to add message to DB
user.addMessage = (from, to, message) => {
    //create unique roomId for chat
    if (from.localeCompare(to) > 0) {
        roomId = sha256(to + from);
    } else {
        roomId = sha256(from + to);
    }
    let chatObj = {
        msgFrom: from,
        msgTo: to,
        msg: message,
        room: roomId,
    }
    return collection.getChatCollection().then(chatColl => {
        return chatColl.create(chatObj).then(data => {
            if (data) return data;
            else return null;
        })
    })
}

//function to get all the messages of users conversation
user.getChatMessages = (from, to) => {
    //get the roomId for the users to get their conversations
    if (from.localeCompare(to) > 0) {
        roomId = sha256(to + from);
    } else {
        roomId = sha256(from + to);
    }
    return collection.getChatCollection().then(chatColl => {
        return chatColl.find({ room: roomId }, { "_id": 0, "room": 0 }).then(data => {
            if (data.length > 0) {
                return data;
            } else {
                return null;
            }
        })
    })
}

module.exports = user;