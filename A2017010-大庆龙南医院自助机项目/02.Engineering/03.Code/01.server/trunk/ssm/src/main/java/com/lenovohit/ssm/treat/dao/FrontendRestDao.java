package com.lenovohit.ssm.treat.dao;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

public interface FrontendRestDao {
	public String getBaseUrl();
	public RestTemplate getRestTemplate() ;
	
	
	public <T> T getForEntity(String url, Class<T> responseType, Object... urlVariables)
			throws RestClientException;

	
	public <T> T getForEntity(String url, Class<T> responseType, Map<String, ?> urlVariables)
			throws RestClientException;

	
	public <T> T getForEntity(URI url, Class<T> responseType) throws RestClientException ;
	
	
	public <T> List<T> getForList(String url, Class<T> responseType, Object... urlVariables)
			throws RestClientException;

	
	public <T> List<T> getForList(String url, Class<T> responseType, Map<String, ?> urlVariables)
			throws RestClientException;

	
	public <T> List<T> getForList(URI url, Class<T> responseType) throws RestClientException ;
	
	
	public <T> T postForEntity(String url, Object request, Class<T> responseType, Map<String, ?> uriVariables) throws RestClientException ;
	
	
	public <T> T postForEntity(String url, Object request, Class<T> responseType, Object... uriVariables)throws RestClientException ;

	
	public <T> T postForEntity(URI url, Object request, Class<T> responseType) throws RestClientException;
	
	
	public void put(String url, Object request, Object... urlVariables) throws RestClientException ;

	
	public void put(String url, Object request, Map<String, ?> urlVariables) throws RestClientException ;

	
	public void put(URI url, Object request) throws RestClientException ;

	// DELETE

	
	public void delete(String url, Object... urlVariables) throws RestClientException ;

	
	public void delete(String url, Map<String, ?> urlVariables) throws RestClientException ;

	
	public void delete(URI url) throws RestClientException;
	
}
