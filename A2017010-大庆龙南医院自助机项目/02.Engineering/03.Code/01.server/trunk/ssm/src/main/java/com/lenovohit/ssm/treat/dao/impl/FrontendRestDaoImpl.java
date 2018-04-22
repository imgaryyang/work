package com.lenovohit.ssm.treat.dao.impl;

import java.lang.reflect.Constructor;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.ssm.treat.dao.FrontendRestDao;


public class FrontendRestDaoImpl implements FrontendRestDao ,InitializingBean{
	
	private String ip;
	
	private int port;
	
	private String path;
	
	private String baseUrl;
	
	@Autowired
    private RestTemplate restTemplate;
	
	
	@Override
	public <T> T getForEntity(String url, Class<T> responseType, Object... urlVariables)
			throws RestClientException {
		ResponseEntity<T> entity =  restTemplate.getForEntity(baseUrl +url, responseType, urlVariables);
		return entity.getBody();
	}

	@Override
	public <T> T getForEntity(String url, Class<T> responseType, Map<String, ?> urlVariables)
			throws RestClientException {
		ResponseEntity<T> entity =  restTemplate.getForEntity(baseUrl +url, responseType, urlVariables);
		return entity.getBody();
	}

	@Override
	public <T> T getForEntity(URI url, Class<T> responseType) throws RestClientException {
		ResponseEntity<T> entity =  restTemplate.getForEntity(baseUrl +url, responseType);
		return entity.getBody();
	}
	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> getForList(String url, Class<T> responseType, Object... urlVariables)
			throws RestClientException {
		System.out.println(responseType+"_getForList :" + " "+baseUrl +url);
		List<Object> list =  restTemplate.getForObject(baseUrl +url, List.class, urlVariables);
		return listMapper(list, responseType);
	}
	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> getForList(String url, Class<T> responseType, Map<String, ?> urlVariables)
			throws RestClientException {
		List<Object> list =  restTemplate.getForObject(baseUrl +url, List.class, urlVariables);
		return listMapper(list, responseType);
	}
	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> getForList(URI url, Class<T> responseType) throws RestClientException {
		List<Object> list =  restTemplate.getForObject(baseUrl +url, List.class);
		return listMapper(list, responseType);
	}
	@Override
	public <T> T postForEntity(String url, Object request, Class<T> responseType, Object... uriVariables)
			throws RestClientException {

		ResponseEntity<T> entity =  restTemplate.postForEntity(baseUrl +url, request, responseType, uriVariables);
		return entity.getBody();
	}

	@Override
	public <T> T postForEntity(String url, Object request, Class<T> responseType, Map<String, ?> uriVariables)
			throws RestClientException {
		ResponseEntity<T> entity =  restTemplate.postForEntity(baseUrl +url, request, responseType, uriVariables);
		return entity.getBody();
	}

	@Override
	public <T> T postForEntity(URI url, Object request, Class<T> responseType) throws RestClientException {
		ResponseEntity<T> entity =  restTemplate.postForEntity(baseUrl +url, request, responseType);
		return entity.getBody();
	}
	
	@Override
	public void put(String url, Object request, Object... urlVariables) throws RestClientException {
		 restTemplate.put(baseUrl +url, request,urlVariables);
	}

	@Override
	public void put(String url, Object request, Map<String, ?> urlVariables) throws RestClientException {
		restTemplate.put(baseUrl +url, request,urlVariables);
	}

	@Override
	public void put(URI url, Object request) throws RestClientException {
		restTemplate.put(baseUrl +url, request);
	}

	// DELETE

	@Override
	public void delete(String url, Object... urlVariables) throws RestClientException {
		restTemplate.delete(baseUrl +url, urlVariables);
	}

	@Override
	public void delete(String url, Map<String, ?> urlVariables) throws RestClientException {
		restTemplate.delete(baseUrl +url, urlVariables);
	}

	@Override
	public void delete(URI url) throws RestClientException {
		restTemplate.delete(baseUrl +url);
	}
	@Override
	public void afterPropertiesSet() throws Exception {
		this.baseUrl = new StringBuilder()
				.append("http://").append(this.ip)
				.append(":").append(this.port).append("/")
				.append(this.path).toString();
	}
	
	private <T> T beanMapper(Object source ,Class<T> responseType) throws FrontendConvertException {
		T t;
		try {
			Constructor<T> con =  responseType.getConstructor() ;
			t = con.newInstance();
			
			if(source instanceof Map){
				BeanUtils.copyProperties((Map<?,?>)source,t);
			}else{
				BeanUtils.copyProperties(source,t);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new FrontendConvertException("exception occur when frontend convert map to bean,e is "+e.getMessage());
		} 
		return t;
	}
	private <T> List<T> listMapper(List<Object> list ,Class<T> responseType) throws FrontendConvertException {
		List<T> result = new ArrayList<T>();
		for(Object obj : list){
			T t = beanMapper(obj,responseType);
			result.add(t);
		}
		return result;
	}
	
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
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
}
