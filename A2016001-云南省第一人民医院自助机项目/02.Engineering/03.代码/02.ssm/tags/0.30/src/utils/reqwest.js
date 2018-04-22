import reqwest from 'reqwest';

function errorHandle(json) {
	console.info('checkStatus',response);
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default function request(url, options) {
	options=options||{};
	options.url = url;
	var response = null; 
	
	function successHandle(json) {
		response = json ;
		console.info(arguments);
		return json;
	}
	
	var r  = reqwest(options).then(successHandle).then();
	console.info(r,response);
	return r;
}
