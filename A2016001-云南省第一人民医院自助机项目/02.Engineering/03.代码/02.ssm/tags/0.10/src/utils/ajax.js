import request from './request';
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
var param_default = {
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
	return request(url,config);
}
function GET(url,param,config) {
	url+="?"+toQueryString(param||{})
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
	Request:Request
}

export default Ajax;
