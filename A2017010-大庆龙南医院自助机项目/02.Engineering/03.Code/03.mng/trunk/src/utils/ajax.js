import request from './request';
var ERROR_HANDLER={};
function addErrorHandler(status,handler){
	var key = ''+status;
	if(!ERROR_HANDLER[key])ERROR_HANDLER[key]= [];
	ERROR_HANDLER[key].push(handler);
}
function handleError(status,response){
	var key = ''+status;
	var handlers = ERROR_HANDLER[key];
	if(handlers && handlers.length > 0){
		for(var handler of handlers){
			handler(status,response);
		}
	}else{
		var handlers ;
		if( status && status >= 400 && status < 500){
			handlers = ERROR_HANDLER['400+'];
		}else if( status && status >= 500){
			handlers = ERROR_HANDLER['500+'];
		}else{
			handlers = ERROR_HANDLER['http'];
		}
		if(handlers && handlers.length > 0){
			for(var handler of handlers){
				if(handler)handler(status,response);
			}
		}
	} 
}
function toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
        var val = obj[key];
        if (Array.isArray(val)) {
            return val.sort().map(function (val2) {
            	if(!val2)val2='';
                return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
        }
        if(!val)val='';
        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
}
var headers = new Headers();
headers.append('X-Requested-With', 'XMLHttpRequest');

var param_default = {
	credentials: 'include',
	headers:headers,
};
var param_get={
	method: 'GET',     
};
var param_post={
	method: 'POST',
};
var param_put={
	method: 'PUT',
};
var param_delete={
	method: 'DELETE',
};
function Request(url,config){
	var response = request(url,config);
	response.then(function(resp){
		if(resp.err){
			if(!resp.err.response)return resp;
			var { status } = resp.err.response;
			handleError(status,resp.err.response);
		}
		return resp;
	});
	return response;
}
function GET(url,param,config) {//
	//url+="?"+toQueryString(param||{})
	var pString = JSON.stringify(param||{});
	url+="?"+toQueryString({data:pString})
    return Request(url, {
		 ...param_default,
		 ...param_get,
		 ...config,
	});
}
function POST(url,param,config) {
	return Request(url, {
		body : JSON.stringify(param||{}),
		 ...param_default,
		 ...param_post,
		 ...config,
	});
}
function PUT(url,param,config) {
	 return Request(url,{
		 body : JSON.stringify(param||{}),
		 ...param_default,
		 ...param_put,
		 ...config,
	 });
}
function DELETE(url,param,config) {
	 return Request(url, {
		 body : JSON.stringify(param||{}),
		 ...param_default,
		 ...param_delete,
		 ...config,
	 });
}

const Ajax={
	GET:GET, 
	DELETE:DELETE,
	POST:POST,
	PUT:PUT,
	Request:Request,
	addErrorHandler:addErrorHandler,
}

export default Ajax;
