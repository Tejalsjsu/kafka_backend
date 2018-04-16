let passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
let salt = bcrypt.genSaltSync(10);


function handle_request(msg, callback){

    let res = {};
    console.log("In handle request:"+ JSON.stringify(msg));

    if(msg.username == "bhavan@b.com" && msg.password =="a"){
        res.code = "200";
        res.value = "Success Login";

    }
    else{
        res.code = "401";
        res.value = "Failed Login";
    }
    callback(null, res);
}

exports.handle_request = handle_request;