let mongodb = new require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";


exports.handle_request = (data, callback)  => {
    var res = {};
    console.log("In fetch data:"+ JSON.stringify(data));
    try{

        console.log(data.fetch);
        MongoClient.connect(url, function (err,db) {
            if(err){
                console.log(err.toString()+ " " +url);
            }
            else{
                console.log("Connection established");
            }
            let dbo = db.db("freelancer");
            dbo.collection("projects").find(
                    { 'employerId':ObjectId(data.userId)}
                )
                .toArray(function(err,result){
                if(err){
                    console.log("Error in getting result");
                    res.status = 401;
                }else if(result.length) {
                    console.log("fetched successfully from db " + result);
                    res.status = 201;
                    res.data = result;
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
