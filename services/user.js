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
            }

        });
        callback(null, res);
    }
    catch (error) {
        console.log(error);
        callback(error, response);
    }
};
