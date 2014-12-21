var http = require ('http');
exports.handler = function(event, context) {
    http.get("http://54.173.170.121/hoge.html", function(res) {
        console.log("Got response: " + res.statusCode);

        res.on("data", function(chunk) {
            context.done(null, chunk);
        });
    }).on('error', function(e) {
        context.done('error', e);
    });
};
