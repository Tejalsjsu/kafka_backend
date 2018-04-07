let connection =  new require('./kafka/Connection');
let login = require('./services/login');
let project = require('./services/project');
let fetch = require('./services/fetch');
let user = require('./services/user');

let kafka_topic = require('./configs/kafka_topics').kafka_topic_enums;

let producer = connection.getProducer();
let MoneyConsumer = connection.getConsumer(kafka_topic.USER);
let fetchConsumer = connection.getConsumer(kafka_topic.FETCH);
let projectConsumer = connection.getConsumer(kafka_topic.PROJECT);

try{
    // Used for both Add and Withdraw money
    MoneyConsumer.on('message', function (message) {
        let data = JSON.parse(message.value);

        console.log('*** message received ***');
        console.log(JSON.stringify(message.value));
        console.log(data.replyTo);

        user.handle_request(data.data, function (err, res) {
            console.log('After Handle Response: ' + res);
            let payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log("Payload: " + payloads);
                console.log("Data: " + data);
                console.log("Error: " + err);
            });
        });
    });

    // projectConsumer.on('message', function (message) {
    //     let data = JSON.parse(message.value);
    //
    //     console.log('*** message received ***');
    //     console.log(JSON.stringify(message.value));
    //     console.log(data.replyTo);
    //
    //     project.handle_request(data.data, function (err, res) {
    //         console.log('After Handle Response: ' + res);
    //         let payloads = [
    //             {
    //                 topic: data.replyTo,
    //                 messages: JSON.stringify({
    //                     correlationId: data.correlationId,
    //                     data: res
    //                 }),
    //                 partition: 0
    //             }
    //         ];
    //         producer.send(payloads, function (err, data) {
    //             console.log("Payload: " + payloads);
    //             console.log("Data: " + data);
    //             console.log("Error: " + err);
    //         });
    //     });
    // });
    //
    // fetchConsumer.on('message', function (message) {
    //     let fetchdata = JSON.parse(message.value);
    //
    //     console.log('*** message received ***');
    //     console.log(JSON.stringify(message.value));
    //     console.log(fetchdata.replyTo);
    //
    //     fetch.handle_request(fetchdata.data, function (err, res) {
    //         console.log('After Handle Response: ' + res);
    //         let payloads = [
    //             {
    //                 topic: fetchdata.replyTo,
    //                 messages: JSON.stringify({
    //                     correlationId: fetchdata.correlationId,
    //                     data: res
    //                 }),
    //                 partition: 0
    //             }
    //         ];
    //         producer.send(payloads, function (err, data) {
    //             console.log("Payload: " + payloads);
    //             console.log("Data: " + data);
    //             console.log("Error: " + err);
    //         });
    //     });
    // });


} catch (error) {
    console.log("Error: " + error);
}



