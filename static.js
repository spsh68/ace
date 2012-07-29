#!/usr/bin/env node

var http = require("http")
  , path = require("path")
  , mime = require("mime")
  , url = require("url")
  , fs = require("fs")
  , port = process.env.PORT || 8888;

// compatibility with node 0.6
if (!fs.exists)
  fs.exists = path.exists;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response._hasBody && response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response._hasBody && response.write(err + "\n");
        response.end();
        return;
      }

	  console.log(filename);
      var contentType = mime.lookup(filename) || "text/plain";
      response.writeHead(200, {"Content-Type": contentType, "X-Local-File-Path": filename});
      response._hasBody && response.write(file, "binary");
      response.end();
    });
  });
}).listen(port, "0.0.0.0");

console.log("http://localhost:" + port);




/*
href = 'http://localhost:8888/kitchen-sink.html'
    var req = new XMLHttpRequest;
    req.open("HEAD", href, false);
    try {
        req.send(null);
    } catch (e) {
    }
	p= req.getResponseHeader("X-Local-File-Path")
#>>
    req.getAllResponseHeaders()
   

f=Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile)

f.initWithPath(p)
f.reveal()

*/



