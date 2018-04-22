var http = require('http');
var qs = require('querystring');

var $hostname =  '127.0.0.1';
var $port =  8080;
var $headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};
var bufferReader = function(chunks,size){
	var data = null;  
	  switch(chunks.length) {  
	    case 0: data = new Buffer(0);  
	    	break;  
	    case 1: data = chunks[0];  
	    	break;  
	    default:  
		    data = new Buffer(size);  
		    for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {  
			    var chunk = chunks[i];  
			    chunk.copy(data, pos);  
			    pos += chunk.length;  
		    }
		    break;  
	  }
  return data.toString('utf-8');
};
module.exports = {
	del : function(path,data,callback,scope){
		scope = scope||this; 
		var chunks=[], size=0;
		console.log('*******************start delete to '+$hostname+path+'***************');
		var content = qs.stringify(data);
		var options = {
		    hostname: $hostname,
		    port: $port,
		    headers:$headers,
		    path: path||'/',
		    method: 'DELETE',
		};
		var req = http.request(options, function (res) {
			var chunks=[];
		    var size=0;
		    res.on('data', function (chunk) {
		        chunks.push(chunk);
		        size += chunk.length;
		    });
		    res.on('end',function(){
		    	var data = bufferReader(chunks,size);
		    	console.log('|  get response :  ',data);
		        callback.call(scope,data)
		    });
		});
		req.on('error', function (e) {
		    console.log('* delete problem with request: ' + e.message);
		});
		req.write(content);
		req.end();
	},
	put : function(path,data,callback,scope){
		scope = scope||this;
		console.log('*******************start put to '+$hostname+path+'***************');
		var content = JSON.stringify(data);
		var options = {
		    hostname: $hostname,
		    port: $port,
		    headers:$headers,
		    path: path||'/',
		    method: 'PUT',
		    headers: {  
		        'Content-Type': 'application/json'  
		    }
		};
		var req = http.request(options, function (res) {
			var chunks=[];
		    var size=0;
		    res.on('data', function (chunk) {
		        chunks.push(chunk);
		        size += chunk.length;
		    });
		    res.on('end',function(){
		    	var data = bufferReader(chunks,size);
		    	console.log('|  get response :  ',data);
		        callback.call(scope,data)
		    });
		});
		req.on('error', function (e) {
		    console.log('* put problem with request: ' + e.message);
		});
		req.write(content);
		req.end();
	},
	post : function(path,data,callback,scope){
		scope = scope||this;
		console.log('*******************start post to '+$hostname+path+'***************');
		var content = JSON.stringify(data);
		var headers = {
		  'Content-Type': 'application/json',
		  'Content-Length': content.length
		};
		var options = {
		    hostname: $hostname,
		    headers: headers,
		    port: $port,
		    path: path||'/',
		    method: 'POST',
		    headers: {  
		        'Content-Type': 'application/json'  
		    }
		};
		var req = http.request(options, function (res) {
			var chunks=[];
		    var size=0;
		    res.on('data', function (chunk) {
		        chunks.push(chunk);
		        size += chunk.length;
		    });
		    res.on('end',function(){
		    	var data = bufferReader(chunks,size);
		    	console.log('|  post response :  ',data);
		        callback.call(scope,data)
		    })
		});
		req.on('error', function (e) {
		    console.log('* post problem with request: ' + e.message);
		});
		req.write(content);
		req.end();
	},
	get : function(path,data,callback,scope){
		scope = scope||this;
		console.log('******************* start get to '+$hostname+path+'***************');
		var content = qs.stringify(data);
		var options = {
		    hostname: $hostname,
		    port: $port,
		    headers:$headers,
		    path: (path||'/')+'?' + content,
		    method: 'GET',
		};
		var req = http.request(options, function (res) {
		    var chunks=[];
		    var size=0;
		    res.on('data', function (chunk) {
		        chunks.push(chunk);
		        size += chunk.length;
		    });
		    res.on('end',function(){
		    	var data = bufferReader(chunks,size);
		    	console.log('|  get response :  ',data);
		        callback.call(scope,data)
		    })
		});
		req.on('error', function (e) {
		    console.log('* get problem with request: ' + e.message);
		});
		req.end();
		//console.log('___________________end get to '+$hostname+path+'___________________');
	}
	
}