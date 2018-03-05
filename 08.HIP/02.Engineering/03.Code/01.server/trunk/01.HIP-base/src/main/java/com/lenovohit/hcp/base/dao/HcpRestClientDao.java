package com.lenovohit.hcp.base.dao;

import java.util.Map;

import com.lenovohit.hcp.base.transfer.RestEntityResponse;
import com.lenovohit.hcp.base.transfer.RestListResponse;
import com.lenovohit.hcp.base.transfer.RestResponse;

public interface HcpRestClientDao {
	/********************************************* GET *************************************************/
	<T> RestEntityResponse<T> getForEntity(String url, Class<T> responseType,  Object... urlVariables);

	<T> RestListResponse<T> getForList(String url, Class<T> responseType,  Object... urlVariables);

	<T> RestResponse getForResponse(String url,Object... urlVariables);
	
	<T> RestEntityResponse<T> getForEntity(String url, Class<T> responseType, Map<String, ?> urlVariables);

	<T> RestListResponse<T> getForList(String url, Class<T> responseType,  Map<String, ?> urlVariables);

	<T> RestResponse getForResponse(String url,Map<String, ?> urlVariables);
	
	/********************************************* POST *************************************************/
	<T> RestEntityResponse<T> postForEntity(String url, Object request, Class<T> responseType, Object... uriVariables);

	<T> RestListResponse<T> postForList(String url, Object request, Class<T> responseType, Object... uriVariables);

	<T> RestResponse postForResponse(String url, Object request, Class<T> responseType, Object... uriVariables);

	/********************************************* PUT *************************************************/
	<T> RestEntityResponse<T> putForEntity(String url, Object request, Class<T> responseType, Object... uriVariables);

	<T> RestListResponse<T> putForList(String url, Object request, Class<T> responseType, Object... uriVariables);

	<T> RestResponse putForResponse(String url, Object request, Class<T> responseType, Object... uriVariables);

	String putForString(String url, Object request, Object... uriVariables);

	/********************************************* DELETE *************************************************/
	<T> RestEntityResponse<T> deleteForEntity(String url, Object request, Class<T> responseType,
			Object... uriVariables);

	<T> RestListResponse<T> deleteForList(String url, Object request, Class<T> responseType, Object... uriVariables);

	<T> RestResponse deleteForResponse(String url, Object request, Class<T> responseType, Object... uriVariables);

	String deleteForString(String url, Object request, Object... uriVariables);

}
