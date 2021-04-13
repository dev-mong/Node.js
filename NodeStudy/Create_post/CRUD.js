var http = require('http');
var fs = require('fs'); //fs module
var url = require('url');
var qs = require('querystring'); //querystring 값 

function html(title,list,body,control){
    return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
    `;
}
function templist(filelist){
    var list = '<ul>';
    var i = 0;
        
    while(i<filelist.length){
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i++;;
    }
    list += '</ul>';

    return list;
}

var app = http.createServer(function(req,res){
    var _url = req.url;  //요청 받은 url
    var queryData = url.parse(_url,true).query; //파라미터
    var pathname = url.parse(_url).pathname; // 파일 경로 위치

    if(pathname == '/'){ 
        if(queryData.id == undefined){
            fs.readdir('./file',function(error,filelist){
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = templist(filelist);
                var template = html(title,list
                                    ,`<h2>${title}</h2><p>${description}</p>`
                                    ,`<a href='/create'>Create</a>`);
                res.writeHead(200);
                res.end(template);
            });
        }
        else{
            fs.readdir('./file',function(err,filelist){
                var list = templist(filelist);
                fs.readFile(`./file/${queryData.id}`,'utf8', function(err,description){
                var title = queryData.id;
                var template = html(title,list,`<h2>${title}</h2><p>${description}</p>`
                                    ,`<a href='/create'>Create</a> <a href='/update?id=${title}'>Update</a>`);
  
                res.writeHead(200);
                res.end(template);
                });  
            });
        }
    } else if(pathname == '/create') {
        fs.readdir('./file',function(error,filelist){
            var title = 'WEB - Create';
            var list = templist(filelist);
            var template = html(title,list
                                ,` <form action="/create_process" method="POST"> 
                                        <p><input type="text" name="title" placeholder="title"></p>
                                        <P>
                                            <textarea name="description" placeholder="description"></textarea>            
                                        </P>
                                        <p>
                                            <input type="submit">
                                        </p>
                                    </form>`
                                ,'');
            
            res.writeHead(200);
            res.end(template);
        })
    } else if(pathname == '/create_process'){
        var body ='';
        
        req.on('data',function(data){ //data는 객체 형식
            body += data;
        });
        req.on('end',function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`./file/${title}`,description,'utf8',function(err){
                //page redirect 
                res.writeHead(302, {Location: `./?id=${title}`});
                res.end();
            });    
        });

    } else if(pathname == '/update'){
        fs.readdir('./file',function(err,filelist){
            var list = templist(filelist);
            fs.readFile(`./file/${queryData.id}`,'utf8', function(err,description){
            var title = queryData.id;
            var template = html(title,list
                                ,` <form action="/update_process" method="POST">
                                    <input type="hidden" name="id" value="${title}"? 
                                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                                    <P>
                                        <textarea name="description" placeholder="description">${description}</textarea>            
                                    </P>
                                    <p>
                                        <input type="submit">
                                    </p>
                                 </form>`
                                ,`<a href='/create'>Create</a> <a href='/update?id=${title}'>Update</a>`);

            res.writeHead(200);
            res.end(template);
            });  
        });
    } else if(pathname == '/update_process'){
        var body ='';
        req.on('data',function(data){ //data는 객체 형식
            body += data;
        });
        req.on('end',function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`./file/${id}`, `./file/${title}`,function(){ //파일 이름을 변경 후
                fs.writeFile(`./file/${title}`,description,'utf8',function(err){ //해당 이름의 파일에 내용을 저장 
                    //page redirect 
                    res.writeHead(302, {Location: `./?id=${title}`});
                    res.end();
                });   
            });
        });    
    }
    else {
        res.writeHead(404);
        res.end('Not found');
      }

});
app.listen(3000);    

