let mongodb = new require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";
let nodemailer = require('nodemailer');

exports.handle_request = (data, callback)  => {
    let res = {};
    console.log("In handle request:"+ JSON.stringify(data));
    let hireDate = new Date(Date.now()).toISOString();

    try{
        MongoClient.connect(url, function (err,db) {
            if(err){
                console.log(err.toString()+ " " +url);
            }
            else{
                console.log("Connection established");
            }
            let dbo = db.db("freelancer");
            dbo.collection("projects").updateOne(
                {_id : ObjectId(data.projectId)},
                {$set: { status: data.status, Hired: data.userId , hireDate: hireDate, bidApproved: data.amount}},
                {upsert: true}, function (err, resultDB) {
                    if (!err) {
                        console.log("No error" +resultDB);
                        // send email if no error

                        var transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                type: 'OAuth2',
                                clientId: 'clientid',
                                clientSecret: 'clientsecret',
                                refreshToken: 'refreshtoken',
                                accessToken: 'accesstoken',
                                user: '*********aria@gmail.com',
                                pass: '***********'
                            }
                        });

                        var mailOptions = {
                            from: 'tejal.padharia@gmail.com',
                            to: 'tejal.padharia@gmail.com',
                            subject: 'Hiring you for project: '+data.ProjectName,
                            text: 'Congratulations!!!' +
                            'You have been selected to work for my project.' +
                            'The bid approved is ' +data.bidApproved+ '. All the best.'
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                                res.status(401).json({'status': '401', 'message': "Send mail failed"});
                            } else {
                                console.log('Email sent: ' + info.response);
                                res.status(201).json({'status': '201'});
                            }
                        });

                        res.message =  "Hire status Updated";
                        res.status= 201;

                    } else {
                        console.log("Error in Hire");
                        res.status = 401;
                        res.message =  "Error in Hire";
                    }

                }
            );
        })
        callback(null, res);
    }
    catch (error) {
        console.log(error);
        callback(error, res);
    }
};
