package com.lenovohit.hwe.treat.dto.impl;

import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;
import com.lenovohit.hwe.treat.transfer.RestResponse;


public class GenericRestDtoImpl<T> implements GenericRestDto<T>{
	
	private Class<T> entityClass; 
	
	public GenericRestDtoImpl(Class<T> entityClass) {
		this.entityClass = entityClass;
	}
	@Value("${his.baseUrl}")
	private String baseUrl;
	
	// @Autowired TODO 使用默认回头看看bean的配置哪儿不对
	private RestTemplate restTemplate = new RestTemplate();
	
	@Override
	public RestEntityResponse<T> getForEntity(String url, Object request, Object... urlVariables)
			throws RestClientException {
		String uri = appendGetPathParam(url, request);
		List<Object> urlVariableList = appendGetPathValue(request, urlVariables);
		ResponseEntity<String> entity = restTemplate.getForEntity(uri, String.class, urlVariableList.toArray());
		return parseEntity(entity.getBody());
	}
	
	@Override
	public RestEntityResponse<T> getForEntity(String url, Object request, Map<String, ?> urlVariables)
			throws RestClientException {
		String uri = appendGetPathParam(url, request);
		Map<String, ?> urlVariableMap = appendGetPathValue(request, urlVariables);
		ResponseEntity<String> entity = restTemplate.getForEntity(uri, String.class, urlVariableMap);
		return parseEntity(entity.getBody());
	}

	@Override
	public RestEntityResponse<T> getForEntity(URI url) throws RestClientException {
		ResponseEntity<String> entity = restTemplate.getForEntity(baseUrl + url, String.class);
		return parseEntity(entity.getBody());
	}
	@Override
	public RestListResponse<T> getForList(String url, Object request, Object... urlVariables) throws RestClientException {
		String uri = appendGetPathParam(url, request);
		List<Object> urlVariableList = appendGetPathValue(request, urlVariables);
		ResponseEntity<String> entity = restTemplate.getForEntity(uri, String.class, urlVariableList.toArray());
		return parseList(entity.getBody());
	}
	@Override
	public RestListResponse<T> getForList(String url, Object request, Map<String, ?> urlVariables) throws RestClientException {
		String uri = appendGetPathParam(url, request);
		Map<String, ?> urlVariableMap = appendGetPathValue(request, urlVariables);
		ResponseEntity<String> entity = restTemplate.getForEntity(uri, String.class, urlVariableMap);
		return parseList(entity.getBody());
	}
	@Override
	public RestListResponse<T> getForList(String url, Map<String, ?> request, Map<String, ?> urlVariables) throws RestClientException {
		String uri = appendGetPathParam(url, request);
		Map<String, ?> urlVariableMap = appendGetPathValue(request, urlVariables);
		ResponseEntity<String> entity = restTemplate.getForEntity(uri, String.class, urlVariableMap);
		return parseList(entity.getBody());
	}
	@Override
	public RestListResponse<T> getForList(URI url) throws RestClientException {
		ResponseEntity<String> entity = restTemplate.getForEntity(baseUrl + url, String.class);
		return parseList(entity.getBody());
	}
	@Override
	public RestEntityResponse<T> postForEntity(String url, Object request, Object... uriVariables)
			throws RestClientException {
		
		ResponseEntity<String> entity =  restTemplate.postForEntity(baseUrl + url, request, String.class, uriVariables);
		return parseEntity(entity.getBody());
	}

	@Override
	public RestEntityResponse<T> postForEntity(String url, Object request, Map<String, ?> uriVariables)
			throws RestClientException {
		
		ResponseEntity<String> entity =  restTemplate.postForEntity(baseUrl + url, request, String.class, uriVariables);
		return parseEntity(entity.getBody());
	}

	@Override
	public RestEntityResponse<T> postForEntity(URI url, Object request) throws RestClientException {
		ResponseEntity<String> entity =  restTemplate.postForEntity(baseUrl + url, request, String.class);
		return parseEntity(entity.getBody());
	}
	
	@Override
	public void put(String url, Object request, Object... urlVariables) throws RestClientException {
		 restTemplate.put(baseUrl + url, request,urlVariables);
	}

	@Override
	public void put(String url, Object request, Map<String, ?> urlVariables) throws RestClientException {
		restTemplate.put(baseUrl + url, request,urlVariables);
	}

	@Override
	public void put(URI url, Object request) throws RestClientException {
		restTemplate.put(baseUrl + url, request);
	}

	// DELETE

	@Override
	public void delete(String url, Object... urlVariables) throws RestClientException {
		restTemplate.delete(baseUrl + url, urlVariables);
	}

	@Override
	public void delete(String url, Map<String, ?> urlVariables) throws RestClientException {
		restTemplate.delete(baseUrl + url, urlVariables);
	}

	@Override
	public void delete(URI url) throws RestClientException {
		restTemplate.delete(baseUrl + url);
	}
	
	private RestEntityResponse<T> parseEntity(String content){
		RestResponse restResponse = JSONUtils.deserialize(content, RestResponse.class);
		RestEntityResponse<T> response = new RestEntityResponse<T>(restResponse);
		String result = restResponse.getResult();
		if(!StringUtils.isEmpty(result)){
			T entity = JSONUtils.parseObject(result, entityClass);
			response.setEntity(entity);
		}
		return response;
	}
	
	private RestListResponse<T> parseList(String content){
		RestResponse restResponse = JSONUtils.deserialize(content, RestResponse.class);
		RestListResponse<T> response = new RestListResponse<T>(restResponse);
		String result = restResponse.getResult();
		if(!StringUtils.isEmpty(result)){
			List<String> strList = JSONUtils.parseObject(result, new TypeReference<List<String>>(){});
			List<T> entList = new ArrayList<T>();
			for(String entStr : strList){
				entList.add(JSONUtils.parseObject(entStr, entityClass));
			}
			response.setList(entList);
		}
		return response;
	}
//	
//	private T beanMapper(Object source ,Class<T> responseType) throws DataConvertException {
//		T t;
//		try {
//			Constructor<T> con =  responseType.getConstructor() ;
//			t = con.newInstance();
//			
//			if(source instanceof Map){
//				BeanUtils.copyProperties((Map<?,?>)source,t);
//			}else{
//				BeanUtils.copyProperties(source,t);
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new DataConvertException("exception occur when frontend convert map to bean,e is "+e.getMessage());
//		} 
//		return t;
//	}
//	private List<T> listMapper(List<Object> list, Class<T> responseType) throws DataConvertException {
//		List<T> result = new ArrayList<T>();
//		for(Object obj : list){
////			String body = JSONObject.toJSONString(entity.getBody());
////			JSONUtils.deserialize(body, entityClass);
//			T t = beanMapper(obj,responseType);
//			result.add(t);
//		}
//		return result;
//	}
	private String appendGetPathParam(String url, Object request){
		if(request == null){
			return baseUrl + url;
		}
		StringBuilder uri = new StringBuilder();
		uri.append(baseUrl).append(url);
		uri.append(url.contains("?")?"&":"?");
		uri.append("data={_data}");	
		
		return uri.toString();
	}
	private List<Object> appendGetPathValue(Object request, Object... urlVariables){
		
		List<Object> urlVariableList = new ArrayList<Object>();
		urlVariableList.addAll(Arrays.asList(urlVariables));
		if(request != null){
			String data = JSONUtils.serialize(request);
			urlVariableList.add(data);
		}
		
		return urlVariableList;
	}
	
	private Map<String, ?> appendGetPathValue(Object request, Map<String, ?> uriVariables){
		Map<String, Object> uriVariableMap = new HashMap<String, Object>();
		if(uriVariables!=null)
			uriVariableMap.putAll(uriVariables);
		if(request != null){
			String data = JSONUtils.serialize(request);
			uriVariableMap.put("_data", (Object)data);
		}
		
		return uriVariableMap;
	}
	public String getBaseUrl() {
		return baseUrl;
	}
	public void setBaseUrl(String baseUrl) {
		this.baseUrl = baseUrl;
	}
	
	public RestTemplate getRestTemplate(){
		return this.restTemplate;
	}

	@Override
	public RestEntityResponse<T> postForEntity(String url, Map<String, ?> request, Map<String, ?> uriVariables) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
