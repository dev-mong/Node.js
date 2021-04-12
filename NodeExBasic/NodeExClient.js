var http = require('http');

var options = {
    host : 'localhost',
    port : '8081',
    path : 'index.html'
}

//콜백 함수 
var callback = function(response){
    var body = '';
    response.on('data',function(data){
        body += data;
    })

    //end 이벤트가 감지되면 데이터 수신을 종료 후 내용 출력
    response.on('end',function(){
        console.log(body);
    });
}

var req = http.request(options,callback);
req.end(); //요청 종료
