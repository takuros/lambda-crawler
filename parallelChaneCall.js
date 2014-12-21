var async = require('async');
var http = require ('http');
var AWS = require('aws-sdk');

exports.handler = function(event, context) {
    function callLambda(context, param) {
        AWS.config.update({
            accessKeyId:"YourAccessKeyId",
            secretAccessKey:"YourSecretAccessKey",
            region:"us-east-1"});
        var lambda = new AWS.Lambda();
        var params = {
            FunctionName: 'parallelCall',
            InvokeArgs: "{\"param\":\"hello lambda!\"}"
        }
        lambda.invokeAsync(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(data);
            }
        });
    }

    function parallel(context) {
        function asyncExec (num,callback) {
            console.log('parallel' + num);
            var i=0;
            while (i<10) {
                callLambda(context, num)
                i=i+1;
            }
            setTimeout(function () {
                console.log('parallel' + num + ' done.');
                callback(null, num);
            }, 100);
        };
        async.parallel([
            function (callback) {
                asyncExec("1", callback);
            },
            function (callback) {
                asyncExec("2", callback);
            },
            function (callback) {
                asyncExec("3", callback);
            },
            function (callback) {
                asyncExec("4", callback);
            },
            function (callback) {
                asyncExec("5", callback);
            },
            function (callback) {
                asyncExec("6", callback);
            },
            function (callback) {
                asyncExec("7", callback);
            },
            function (callback) {
                asyncExec("8", callback);
            },
            function (callback) {
                asyncExec("9", callback);
            },
            function (callback) {
                asyncExec("10", callback);
            }
        ], function (err, results) {
            if (err) { throw err; }
            console.log('parallel all done. ' + results);
        });
    }
    parallel(context);
};
