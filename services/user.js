let mongodb = new require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID;
var async = require("async");

exports.handle_request = (data, callback)  => {
    let res = {};
    console.log("In handle request user:"+ JSON.stringify(data));
    try{
        MongoClient.connect(url, function (err,db) {
            if(err){
                console.log(err.toString()+ " " +url);
            }
            else{
                console.log("Connection established");
            }
            let dbo = db.db("freelancer");
            switch (data.apiCall){
                case "AddMoney": {
                    dbo.collection("login").updateOne(
                        {_id: ObjectId(data.userId)},
                        {$push: {
                                transactionHistory:
                                    {
                                        "transactionDate": data.addDate, "transactionType": data.transactionType,
                                        "cardNo": data.paymentData.cardNo ,"totalAmount": data.paymentData.totalAmount, "expiryDate":data.paymentData.expiryDate,
                                        "cardHolderName":data.paymentData.cardHolderName, "ccv":data.paymentData.ccv, "billingZip":data.paymentData.billingZip,
                                        "depositAmount":data.paymentData.depositAmount, "processingFee":data.paymentData.processingFee
                                    }
                            }
                        },
                        function(err, resultDB){
                            if (!err) {
                                console.log("No error" +resultDB);
                                res.message =  "Money added successful";
                                res.status = 201;
                            } else {
                                console.log("Error in adding Money" +err);
                                res.status = 401;
                                res.message =  "Project could not be posted";
                            }
                        });
                    }
                    break;

                case "EditProfile":{
                    dbo.collection("login").updateOne(
                        {_id: ObjectId(data.userId)},
                        {
                            $set: {
                                professionalHeading: data.professionalHeading,
                                aboutUser: data.reqDescription,
                                skills: data.reqSkills,
                                Phone: data.reqPhone,
                                lastUpdated: data.reqlastUpdated
                            }
                        },
                        function(err, resultDB){
                            if (!err) {
                                console.log("No error" +resultDB);
                                res.message =  "Profile Updated";
                                res.status = 201;
                            } else {
                                console.log("Error in Profile Update" +err);
                                res.status = 401;
                                res.message =  "Profile could not be updated";
                            }
                        });
                }

                    break;

                case "signup": {

                    let userData = { username: data.reqUsername, password: data.hash, email: data.reqEmail};
                    dbo.collection("login").insertOne(userData,
                        function(err, resultDB){
                            if (!err) {
                                console.log("No error" +resultDB);
                                res.message =  "Money added successful";
                                res.status = 201;
                            } else {
                                console.log("Error in adding Money" +err);
                                res.status = 401;
                                res.message =  "Project could not be posted";
                            }
                        });
                }
                break;

            }

        });
        callback(null, res);
    }
    catch (error) {
        console.log(error);
        callback(error, response);
    }
};
