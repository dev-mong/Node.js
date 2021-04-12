var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){

    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url).pathname; //query string 포함 한 url 주소
    var title = queryData.id;

    if(pathname == '/'){
        fs.readFile(`./file/${queryData.id}`,'utf8',function(err,desciption){
            var html = `
            <!doctype html>
            <html>
            <head>
                <title>WEB - ${title}</title>
                <meta charset = "utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
                <ul>
                <li><a href="/?id=html">HTML</a></li>
                <li><a href="/?id=css">CSS</a></li>
                <li><a href="/?id=js">JS</a></li>
            </ul>
        
            <h2>
                ${title}
            </h2>
            <p>${desciption}</p>
            <p
            </body>
            <html/>
            `;   
            response.writeHead(200);
            response.end(html); //NOT Found 결과
        });
    }else{
        response.writeHead(404);
        response.end('NOT Found'); //NOT Found 결과
    }
});

app.listen(3000);