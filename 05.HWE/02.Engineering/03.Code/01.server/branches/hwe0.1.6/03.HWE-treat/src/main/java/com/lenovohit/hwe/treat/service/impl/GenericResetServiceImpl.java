package com.lenovohit.hwe.treat.service.impl;


import java.net.URI;
import java.util.List;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.service.GenericRestService;

/**
 * 
 * @author xiaweiyi
 */
public class GenericResetServiceImpl<T> implements GenericRestService<T> {

	GenericRestDto<T> dto;

	public GenericResetServiceImpl(final GenericRestDto<T> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public T getForEntity(String url, Object... urlVariables) {
		return dto.getForEntity(url, urlVariables).getEntity();
	}

	@Override
	public T getForEntity(String url, Map<String, ?> urlVariables) {
		return dto.getForEntity(url, urlVariables).getEntity();
	}

	@Override
	public T getForEntity(URI url) {
		return dto.getForEntity(url).getEntity();
	}

	@Override
	public List<T> getForList(String url, Object... urlVariables) {
		return dto.getForList(url, urlVariables).getList();
	}

	@Override
	public List<T> getForList(String url, Map<String, ?> urlVariables) {
		return dto.getForList(url, urlVariables).getList();
	}

	@Override
	public List<T> getForList(URI url) {
		return dto.getForList(url).getList();
	}

	@Override
	public T postForEntity(String url, Object request, Map<String, ?> uriVariables) {
		return dto.postForEntity(url, request,uriVariables).getEntity();
	}

	@Override
	public T postForEntity(String url, Object request, Object... uriVariables) {
		return dto.postForEntity(url, request, uriVariables).getEntity();
	}

	@Override
	public T postForEntity(URI url, Object request) {
		return dto.postForEntity(url, request).getEntity();
	}

	@Override
	public void put(String url, Object request, Object... urlVariables) {
		dto.put(url, request, urlVariables);
	}

	@Override
	public void put(String url, Object request, Map<String, ?> urlVariables) {
		dto.put(url, request, urlVariables);
	}

	@Override
	public void put(URI url, Object request) {
		dto.put(url, request);
	}

	@Override
	public void delete(String url, Object... urlVariables) {
		dto.delete(url, urlVariables);
	}

	@Override
	public void delete(String url, Map<String, ?> urlVariables) {
		dto.delete(url,urlVariables) ;
	}

	@Override
	public void delete(URI url) {
		dto.delete(url);
	}


}
