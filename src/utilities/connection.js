const { Schema } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('userCreateIndex', true);
const url = "mongodb://localhost:27017/UsersDB"

const chatSchema = new Schema({
    msgFrom: { type: String, default: "", required: true },
    msgTo: { type: String, default: "", required: true },
    msg: { type: String, default: "", required: true },
    room: { type: String, default: "", required: true },
    createdOn: { type: Date, default: new Date().toISOString() }
});

const usersSchema = Schema({
    userId: { type: String, required: [true, 'userId is required'] },
    uCredentials: {
        uEmail: {
            type: String, required: [true, 'uMail is required'], validate: {
                validator: function (v) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                }
            },
        },
        uPass: { type: String, required: [true, 'uPass is required'] },
        salt: { type: String }
    },
    uProfile: {
        uName: {
            type: String, required: [true, 'uName is required'], validate: {
                validator: function (v) {
                    return /^[a-zA-Z][a-zA-Z ]+$/.test(v);
                }
            },
        },
        uPhone: { type: Number, required: [true, 'uPhone is required'] },
        uDateJoined: { type: Date, default: new Date().toISOString() },
        uLastLogin: { type: Date, default: new Date().toISOString() }
    },
}, { collection: "Users", timestamps: true })

let connection = {}

//Returns model object of "Users" collection
connection.getCollection = () => {
    //establish connection and return model as promise
    return mongoose.connect(url, { useNewUrlParser: true }).then(database => {
        return database.model('Users', usersSchema)
    }).catch(() => {
        let err = new Error("Could not connect to the database");
        err.status = 500;
        throw err;
    });
}

//Returns model object of "Chat" collection
connection.getChatCollection = () => {
    //establish connection and return model as promise
    return mongoose.connect(url, { useNewUrlParser: true }).then(database => {
        return database.model('Chat', chatSchema)
    }).catch(() => {
        let err = new Error("Could not connect to the Message database");
        err.status = 500;
        throw err;
    });
}

module.exports = connection;