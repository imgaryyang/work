package com.lenovohit.hwe.treat.dto;

import java.net.URI;
import java.util.Map;

import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface GenericRestDto<T> {

	public String getBaseUrl();

	public RestTemplate getRestTemplate();

	public RestEntityResponse<T> getForEntity(String url, Object request, Object... urlVariables);

	public RestEntityResponse<T> getForEntity(String url, Object request, Map<String, ?> urlVariables);

	public RestEntityResponse<T> getForEntity(URI url);

	public RestListResponse<T> getForList(String url, Object request, Object... urlVariables);

	public RestListResponse<T> getForList(String url, Object request, Map<String, ?> urlVariables);

	public RestListResponse<T> getForList(String url, Map<String, ?> request, Map<String, ?> urlVariables);
	
	public RestListResponse<T> getForList(URI url);

	public RestEntityResponse<T> postForEntity(String url, Object request, Map<String, ?> uriVariables);
	
	public RestEntityResponse<T> postForEntity(String url, Map<String, ?> request, Map<String, ?> uriVariables);

	public RestEntityResponse<T> postForEntity(String url, Object request, Object... uriVariables) throws RestClientException;

	public RestEntityResponse<T> postForEntity(URI url, Object request) throws RestClientException;

	public void put(String url, Object request, Object... urlVariables);

	public void put(String url, Object request, Map<String, ?> urlVariables);

	public void put(URI url, Object request);

	// DELETE

	public void delete(String url, Object... urlVariables);

	public void delete(String url, Map<String, ?> urlVariables);

	public void delete(URI url) throws RestClientException;

}
