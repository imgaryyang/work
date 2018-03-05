package com.lenovohit.hcp.base.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.hcp.base.dao.HcpRestClientDao;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.transfer.RestEntityResponse;
import com.lenovohit.hcp.base.transfer.RestListResponse;
import com.lenovohit.hcp.base.transfer.RestResponse;

public class HcpRestClientDaoImpl implements HcpRestClientDao{
	private RestTemplate restTemplate = new RestTemplate();
	/*********************************************GET*************************************************/
	public <T> RestEntityResponse<T> getForEntity(String url, Class<T> responseType, Object... urlVariables) {
		String text =  restTemplate.getForObject(url, String.class, urlVariables);
		@SuppressWarnings("unchecked")
		RestEntityResponse<T> response = JSONUtils.deserialize(text, RestEntityResponse.class);
		if(!response.isSuccess())return response;
		
		String content = response.getResult();
		T t = JSONUtils.parseObject(content,responseType);
		response.setEntity(t);
		return response;
	}
	public <T> RestListResponse<T> getForList(String url, Class<T> responseType, Object... urlVariables) {
		String text =  restTemplate.getForObject(url, String.class, urlVariables);
		@SuppressWarnings("unchecked")
		RestListResponse<T> response = JSONUtils.deserialize(text, RestListResponse.class);
		if(!response.isSuccess())return response;
		String content = response.getResult();
		List<String> list = JSONUtils.parseObject(content,new TypeReference<List<String>>(){});
		List<T> result = new ArrayList<T>();
		for(String str : list ){
			System.out.println(str);
			T t = JSONUtils.parseObject(str,responseType);
			result.add(t);
		}
		response.setList(result);
		return response;
	}
	public <T> RestResponse getForResponse(String url,Object... urlVariables) {
		String response =  restTemplate.getForObject(url, String.class, urlVariables);
		RestResponse reponse = JSONUtils.deserialize(response, RestResponse.class);
		return reponse;
	}
	
	
	public <T> RestEntityResponse<T> getForEntity(String url, Class<T> responseType,Map<String, ?> urlVariables) {
		String text =  restTemplate.getForObject(url, String.class, urlVariables);
		@SuppressWarnings("unchecked")
		RestEntityResponse<T> response = JSONUtils.deserialize(text, RestEntityResponse.class);
		if(!response.isSuccess())return response;
		
		String content = response.getResult();
		T t = JSONUtils.parseObject(content,responseType);
		response.setEntity(t);
		return response;
	}
	public <T> RestListResponse<T> getForList(String url, Class<T> responseType, Map<String, ?> urlVariables) {
		String text =  restTemplate.getForObject(url, String.class, urlVariables);
		@SuppressWarnings("unchecked")
		RestListResponse<T> response = JSONUtils.deserialize(text, RestListResponse.class);
		if(!response.isSuccess())return response;
		String content = response.getResult();
		List<String> list = JSONUtils.parseObject(content,new TypeReference<List<String>>(){});
		List<T> result = new ArrayList<T>();
		for(String str : list ){
			System.out.println(str);
			T t = JSONUtils.parseObject(str,responseType);
			result.add(t);
		}
		response.setList(result);
		return response;
	}
	public <T> RestResponse getForResponse(String url,Map<String, ?> urlVariables) {
		String response =  restTemplate.getForObject(url, String.class, urlVariables);
		RestResponse reponse = JSONUtils.deserialize(response, RestResponse.class);
		return reponse;
	}
	/*********************************************POST*************************************************/
	public <T> RestEntityResponse<T> postForEntity(String url, Object request, Class<T> responseType, Object... uriVariables) {
		String text =  restTemplate.postForObject(url, request, String.class,uriVariables);
		@SuppressWarnings("unchecked")
		RestEntityResponse<T> response = JSONUtils.deserialize(text, RestEntityResponse.class);
		if(!response.isSuccess())return response;
		
		String content = response.getResult();
		T t = JSONUtils.parseObject(content,responseType);
		response.setEntity(t);
		return response;
	}
	public <T> RestListResponse<T> postForList(String url, Object request, Class<T> responseType, Object... uriVariables) {
		String text =   restTemplate.postForObject(url, request, String.class,uriVariables);
		@SuppressWarnings("unchecked")
		RestListResponse<T> response = JSONUtils.deserialize(text, RestListResponse.class);
		if(!response.isSuccess())return response;
		String content = response.getResult();
		List<String> list = JSONUtils.parseObject(content,new TypeReference<List<String>>(){});
		List<T> result = new ArrayList<T>();
		for(String str : list ){
			System.out.println(str);
			T t = JSONUtils.parseObject(str,responseType);
			result.add(t);
		}
		response.setList(result);
		return response;
	}
	public <T> RestResponse postForResponse(String url, Object request, Class<T> responseType, Object... uriVariables) {
		String response =  restTemplate.postForObject(url, request, String.class,uriVariables);
		RestResponse reponse = JSONUtils.deserialize(response, RestResponse.class);
		return reponse;
	}
	
	/*********************************************PUT*************************************************/
	public <T> RestEntityResponse<T> putForEntity(String url, Object request, Class<T> responseType, Object... uriVariables) {
		String text = putForString(url, request,uriVariables);
		@SuppressWarnings("unchecked")
		RestEntityResponse<T> response = JSONUtils.deserialize(text, RestEntityResponse.class);
		if(!response.isSuccess())return response;
		
		String content = response.getResult();
		T t = JSONUtils.parseObject(content,responseType);
		response.setEntity(t);
		return response;
	}
	public <T> RestListResponse<T> putForList(String url, Object request, Class<T> responseType, Object... uriVariables) {
		String text = putForString(url, request,uriVariables);
		@SuppressWarnings("unchecked")
		RestListResponse<T> response = JSONUtils.deserialize(text, RestListResponse.class);
		if(!response.isSuccess())return response;
		String content = response.getResult();
		List<String> list = JSONUtils.parseObject(content,new TypeReference<List<String>>(){});
		List<T> result = new ArrayList<T>();
		for(String str : list ){
			System.out.println(str);
			T t = JSONUtils.parseObject(str,responseType);
			result.add(t);
		}
		response.setList(result);
		return response;
	}
	public <T> RestResponse putForResponse(String url, Object request, Class<T> responseType, Object... uriVariables) {
		String text = putForString(url, request,uriVariables);
		RestResponse reponse = JSONUtils.deserialize(text, RestResponse.class);
		return reponse;
	}
	public String putForString(String url, Object request, Object... uriVariables) {
		HttpEntity<String> requestEntity = new HttpEntity<String>(JSONUtils.serialize(request));
		ResponseEntity<String> responseEntity =  restTemplate.exchange(url, HttpMethod.PUT, requestEntity, String.class);
		return responseEntity.getBody();
	}
	/********************************************* DELETE *************************************************/
	public <T> RestEntityResponse<T> deleteForEntity(String url, Object request, Class<T> responseType, Object... uriVariables) {
		String text = putForString(url, request,uriVariables);
		@SuppressWarnings("unchecked")
		RestEntityResponse<T> response = JSONUtils.deserialize(text, RestEntityResponse.class);
		if(!response.isSuccess())return response;
		
		String content = response.getResult();
		T t = JSONUtils.parseObject(content,responseType);
		response.setEntity(t);
		return response;
	}
	public <T> RestListResponse<T> deleteForList(String url, Object request, Class<T> responseType, Object... uriVariables) {
		String text = putForString(url, request,uriVariables);
		@SuppressWarnings("unchecked")
		RestListResponse<T> response = JSONUtils.deserialize(text, RestListResponse.class);
		if(!response.isSuccess())return response;
		String content = response.getResult();
		List<String> list = JSONUtils.parseObject(content,new TypeReference<List<String>>(){});
		List<T> result = new ArrayList<T>();
		for(String str : list ){
			T t = JSONUtils.parseObject(str,responseType);
			result.add(t);
		}
		response.setList(result);
		return response;
	}
	public <T> RestResponse deleteForResponse(String url, Object request, Class<T> responseType, Object... uriVariables) {
		String text = putForString(url, request,uriVariables);
		RestResponse reponse = JSONUtils.deserialize(text, RestResponse.class);
		return reponse;
	}
	public String deleteForString(String url, Object request, Object... uriVariables) {
		HttpEntity<String> requestEntity = new HttpEntity<String>(JSONUtils.serialize(request));
		ResponseEntity<String> responseEntity =  restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, String.class);
		return responseEntity.getBody();
	}
	
	public static void main(String args[]) {
		HcpRestClientDaoImpl dao = new HcpRestClientDaoImpl();
		RestListResponse<HcpUser> response = dao.getForList("http://127.0.0.1/api//hcp/base/user/list", HcpUser.class);
		for(HcpUser user : response.getList()){
			System.out.println(user.getName());
		}
	}
}
