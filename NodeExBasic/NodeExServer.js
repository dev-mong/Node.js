var http = require('http');
var fs = require('fs');
var url = require('url');

//서버 생성
http.createServer(function(request,response){
    var pathname = url.parse(request.url).pathname;

    console.log("Request for " + pathname + " received.");

    if(pathname == "/"){ //파일 이름이 비어있다면 .. 
        pathname = "/index.html";        
    }

    //비동기 파일 읽기 
    fs.readFile(pathname.substr(1), function(err, data){
        if (err){
            console.log(err);
            //Not Found " 404"
            response.writeHead(404,{'Content-type': 'text/html'});
        }else{ //http 200
            response.writeHead(200,{'content-type': 'text/html'});
            response.write(data.toString());
        }

        response.end(); //end 이벤트 발생 
    })
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');