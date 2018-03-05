package com.lenovohit.hwe.treat.service;

import java.net.URI;
import java.util.List;
import java.util.Map;

public interface GenericRestService<T> {

	public T getForEntity(String url, Object... urlVariables);

	public T getForEntity(String url, Map<String, ?> urlVariables);

	public T getForEntity(URI url);

	public List<T> getForList(String url, Object... urlVariables);

	public List<T> getForList(String url, Map<String, ?> urlVariables);

	public List<T> getForList(URI url);

	public T postForEntity(String url, Object request, Map<String, ?> uriVariables);

	public T postForEntity(String url, Object request, Object... uriVariables);

	public T postForEntity(URI url, Object request);

	public void put(String url, Object request, Object... urlVariables);

	public void put(String url, Object request, Map<String, ?> urlVariables);

	public void put(URI url, Object request);

	// DELETE

	public void delete(String url, Object... urlVariables);

	public void delete(String url, Map<String, ?> urlVariables);

	public void delete(URI url);
}
