# NodeAssignment
For McKinley &amp; Rice

# Steps to Configure and Run Node Project

1) Clone into the project https://github.com/harshulsinghal/NodeAssignment.git
2) Open file utilities/connection.js and change the `const url = "mongodb://localhost:27017/UsersDB"` to your mongoDB url
3) Make sure your mongodb is running
4) Open the NodeAssignment folder and execute the following commands:
    `npm install`
    `cd src`
    `node app`

# API Calls and Params

1)  URL: `http://localhost:3000/register`
    METHOD: `POST`
    REQUEST-BODY: `application/json`
    BODY: {
        "uCredentials":{
            "uEmail":"johndoe@mckinley.com",
            "uPass":"John@12345"
        },
        "uProfile":{
            "uName":"John Doe",
            "uPhone":7830683010
        }
    }

2)  URL: `http://localhost:3000/login`
    METHOD: `POST`
    REQUEST-BODY: `application/json`
    BODY: {
            "uEmail":"johndoe@mckinley.com",
            "uPass":"John@12345"
    }

3)  URL: `http://localhost:3000/sendMessage`
    METHOD: `POST`
    REQUEST-BODY: `application/json`
    BODY: {
            "from":"johndoe@mckinley.com",
            "to":"nickfury@mckinley.com",
            "msgBody":"Hi There!"
    }

4)  URL: `http://localhost:3000/getMessages/Parameter1/Parameter2`
    METHOD: `GET`
    Parameter1: EMail of User From: eg: `johndoe@mckinley.com`
    Parameter2: EMail of User To: eg: `nickfury@mckinley.com`

# Future Modifications

1) JWT (Json Web Token) based authentication.
2) Give Project Microservices structure giving seperate microservices for users and chat
