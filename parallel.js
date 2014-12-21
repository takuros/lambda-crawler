var async = require('async');
var http = require ('http');

exports.handler = function(event, context) {
    function getHtml(context, param) {
        http.get("http://54.173.170.121/hoge.html?call="+param, function(res) {
            console.log("Got response: " + res.statusCode);

            res.on("data", function(chunk) {
                context.done(null, chunk);
            });
        }).on('error', function(e) {
            context.done('error', e);
        });
    }

    function parallel(context) {
        async.parallel([
            function (callback) {
                console.log('parallel 1');
                getHtml(context, "1")
                setTimeout(function () {
                    console.log('parallel 1 done.');
                    callback(null, 1);
                }, 500);
            },
            function (callback) {
                console.log('parallel 2');
                getHtml(context, "2")
                setTimeout(function () {
                    console.log('parallel 2 done.');
                    callback(null, 2);
                }, 300);
             },
             function (callback) {
                console.log('parallel 3');
                getHtml(context, "3")
                setTimeout(function () {
                    console.log('parallel 3 done.');
                    callback(null, 3);
                }, 100);
             }
        ], function (err, results) {
            if (err) { throw err; }
            console.log('parallel all done. ' + results);
        });
    }
    parallel(context);
};
