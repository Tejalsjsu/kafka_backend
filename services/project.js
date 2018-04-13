let mongodb = new require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";


exports.handle_request = (data, callback)  => {
    let res = {};
    console.log("In handle request:"+ JSON.stringify(data));
    try{
        MongoClient.connect(url, function (err,db) {
            if(err){
                console.log(err.toString()+ " " +url);
            }
            else{
                console.log("Connection established");
            }
            let dbo = db.db("freelancer");
            dbo.collection("projects").insertOne(data, function(err, resultDB){
                if (!err) {
                    console.log("No error" +resultDB);
                    res.message =  "Project posted successful";
                    res.status= 201;
                } else {
                    console.log("Error in posting result");
                    res.status = 401;
                    res.message =  "Project could not be posted";
                }
            });
        });
        callback(null, res);
    }
    catch (error) {
            console.log(error);
            callback(error, res);
        }
};
