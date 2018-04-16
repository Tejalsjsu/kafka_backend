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
            switch (data.project){
                case 'ALL':
                    //Fetch all projects
                    dbo.collection("projects").find({'status': data.status})
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
                    break;

                case 'CURRENTUSER':
                    //Fetch projects only for logged in user as an employer
                    dbo.collection("projects").find(
                        { 'employerId':ObjectId(data.userId), 'status': data.status}
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
                    break;

                case 'FREELANCER':
                    //Fetch projects only for logged in user on which he is currently working i.e as a freelancer
                    dbo.collection("projects").find(
                        { 'Hired':ObjectId(data.userId), 'status': data.status}
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
                    break;
            }
        });

        callback(null, res);
    }
    catch (error) {
        console.log(error);
        callback(error, res);
    }
};
