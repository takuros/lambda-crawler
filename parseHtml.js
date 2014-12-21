console.log('Loading event');
var cheerio = require('cheerio');
var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});
var http = require ('http');

exports.handler = function(event, context) {
    var record = event.Records[0];
    var bucket = record.s3.bucket.name;
    var key = record.s3.object.key;
    console.log('record:' + record);
    console.log('bucket:' + bucket);
    console.log('key:' + key);
    getObject(context, bucket, key)
    function getObject(context, bucket, key) {
        console.log('s3 getObject');
        s3.getObject({Bucket:bucket, Key:key},
            function(err,data) {
                if (err) {
                    console.log('error getting object ' + key + ' from bucket ' + bucket +
                       '. Make sure they exist and your bucket is in the same region as this function.');
                    context.done('error','error getting file'+err);
                }
                else {
                    var contentEncoding = data.ContentEncoding;
                    var contentBody = data.Body.toString(contentEncoding);
                    parseHtml(context, contentBody); 
                }
            }
        );
    }
    function parseHtml(context, body) {
        console.log('parseHtml');
        var $ = cheerio.load(body);
        var title = $("title").text();
        var stockPrice = $('td[class=stoksPrice]').text();
        console.log('stockPrice:'+stockPrice);
    }	
};
