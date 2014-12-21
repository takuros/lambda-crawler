console.log('Loading event');
var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});
var http = require ('http');

exports.handler = function(event, context) {
    var bucket = 'lambda-crawler';
    var key = 'test';
    var body;
    http.get("http://stocks.finance.yahoo.co.jp/stocks/history/?code=9984.T", function(res) {
        console.log("Got response: " + res.statusCode);
        res.on("data", function(chunk) {
            console.log('chunk: ');
            body += chunk;
        });

        res.on('end', function(res) {
            console.log('end')
            putObject(context, bucket, key ,body);
        });
    }).on('error', function(e) {
        context.done('error', e);
    });

    function putObject(context, bucket, key ,body) {
        var params = {Bucket: bucket, Key: key, Body: body};
        console.log('s3 putObject' + params);

        s3.putObject(params, function(err, data) {
            if (err) {
                console.log('put error' + err);  
                context.done(null, err);
            } else {
                console.log("Successfully uploaded data to myBucket/myKey");
                context.done(null, "done");
            }
        });
    }
};
