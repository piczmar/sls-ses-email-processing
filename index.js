'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var bucketName = process.env.BUCKET;
var simpleParser = require('mailparser').simpleParser;

module.exports.handler = function (event, context, callback) {
    console.log('Process email');
    console.log(event.Records[0]);
    var s3Object = event.Records[0].s3.object;
    console.log("S3 Obj.:\n", JSON.stringify(s3Object, null, 2));

    // Retrieve the email from your bucket
    var req = {
        Bucket: bucketName,
        Key: s3Object.key
    };

    s3.getObject(req, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        } else {
            console.log("Raw email:\n" + data.Body);

            // Custom email processing goes here
            simpleParser(data.Body, (err, parsed) => {
                if (err) {
                    console.log(err, err.stack);
                    callback(err);
                } else {
                    console.log("date:", parsed.date);
                    console.log("subject:", parsed.subject);
                    console.log("body:", parsed.text);
                    console.log("from:", parsed.from.text);
                    console.log("attachments:", parsed.attachments);
                    callback(null, null);
                }
            });
        }
    });
};