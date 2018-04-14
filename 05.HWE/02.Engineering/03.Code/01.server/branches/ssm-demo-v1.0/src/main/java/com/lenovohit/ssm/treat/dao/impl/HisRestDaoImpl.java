package com.lenovohit.ssm.treat.dao.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.Encodes;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.dao.RestResponse;

public class HisRestDaoImpl implements HisRestDao {
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	private static String access_token = "";
	private static Date expires_time = new Date();
	private static int expires_in = 0;

	private String location;
	private String postUrl;
	private String needAuth;
	private String authorizeUrl;
	private String appid;
	private String secret;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getPostUrl() {
		return postUrl;
	}

	public void setPostUrl(String postUrl) {
		this.postUrl = postUrl;
	}
	
	public String getNeedAuth() {
		return needAuth;
	}

	public void setNeedAuth(String needAuth) {
		this.needAuth = needAuth;
	}

	public String getAuthorizeUrl() {
		return authorizeUrl;
	}

	public void setAuthorizeUrl(String authorizeUrl) {
		this.authorizeUrl = authorizeUrl;
	}
	
	public String getAppid() {
		return appid;
	}

	public void setAppid(String appid) {
		this.appid = appid;
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	// @Autowired TODO 使用默认回头看看bean的配置哪儿不对
	private RestTemplate restTemplate = new RestTemplate();

	public RestEntityResponse postForEntity(String code, String sendType, Object param) {
		RestRequest request = new RestRequest();
		request.setCode(code);
		request.setParam(param);
		request.setSendType(sendType);
		return postForEntity(request);
	}

	public  RestListResponse postForList(String code, String sendType, Object param) {
		RestRequest request = new RestRequest();
		request.setCode(code);
		request.setParam(param);
		request.setSendType(sendType);
		return postForList(request);
	}

	public RestEntityResponse postForEntity(RestRequest request) {
		RestResponse response = post(request);
		return new RestEntityResponse(response);
	}

	public  RestListResponse postForList(RestRequest request) {
		RestResponse response = post(request);
		return new RestListResponse(response);
	}

	public RestResponse post(RestRequest request) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
			List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
			acceptableMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
			headers.setAccept(acceptableMediaTypes);
			
			String url = null;
			if(StringUtils.equals(RestRequest.SEND_TYPE_POST, request.getSendType())){
				url = postUrl;
			} else {
				url = location;
			}
			if(StringUtils.isEmpty(HisRestDaoImpl.access_token) || new Date().after(DateUtils.addSecond(HisRestDaoImpl.expires_time, HisRestDaoImpl.expires_in))){
				initToken();
			}
			request.setToken(HisRestDaoImpl.access_token);
			String uuid = com.lenovohit.core.utils.StringUtils.uuid();
			log.info(uuid+" HisRequest: URL 【" + url + "】");
			log.info(uuid+" HisRequest: Code【" + request.getCode() + "】");
			log.info(uuid+" HisRequest: param【" + JSONUtils.serialize(request.getParam()) + "】");

			HttpEntity<String> requestEntity = new HttpEntity<String>(JSONUtils.serialize(request), headers);
			ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, requestEntity, String.class);
			RestResponse response = JSONUtils.deserialize(responseEntity.getBody(), RestResponse.class);
			
			log.info(uuid+" HisRequest: response 【" + JSONUtils.serialize(response) + "】");
			return response;
		} catch (Exception e) {
			 log.error(" HisRestDao exception:", e);
			 e.printStackTrace();
			// TODO: handle exception
		}
		return null;
	}
	
	protected void initToken() {
		RestTemplate template = new RestTemplate();
		Map<String,String> params = new HashMap<String,String>();
		String timestamp = DateUtils.getCurrentDateTimeStr();
		String origin = appid + secret + timestamp;
		params.put("as_appid", appid);
		params.put("as_secret", Encodes.md5Encrypt(origin));
		params.put("as_timestamp", timestamp);
		try {
			String uuid = com.lenovohit.core.utils.StringUtils.uuid();
			log.info(uuid+" HisRequest: TokenUrl 【" + authorizeUrl + "】");
			log.info(uuid+" HisRequest: TokenParam【" + JSONUtils.serialize(params) + "】");

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
			List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
			acceptableMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
			headers.setAccept(acceptableMediaTypes);
			HttpEntity<String> requestEntity = new HttpEntity<String>(JSONUtils.serialize(params), headers);
			ResponseEntity<String> responseEntity = template.postForEntity(authorizeUrl, requestEntity, String.class);
			RestResponse response = JSONUtils.deserialize(responseEntity.getBody(), RestResponse.class);
			log.info(uuid+" HisRequest: TokenResponse 【" + JSONUtils.serialize(response) + "】");
			
			//更新Token
			HisRestDaoImpl.access_token = response.getAccess_token();
			HisRestDaoImpl.expires_in =  response.getExpires_in();
			HisRestDaoImpl.expires_time =  new Date();
			
			System.out.println(JSONUtils.serialize(response));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public static void main(String args[]){
		RestTemplate restTemplate = new RestTemplate();
		Map<String,String> params = new HashMap<String,String>();
		String appid = "ZYS";
		String timestamp = DateUtils.getCurrentDateTimeStr();
		String origin = appid + "]mIC9oKfq?U`a]]r" + timestamp;
		params.put("as_appid", appid);
		params.put("as_secret", Encodes.md5Encrypt(origin));
		params.put("as_timestamp", timestamp);
		System.out.println(JSONUtils.serialize(params));
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
			List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
			acceptableMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
			headers.setAccept(acceptableMediaTypes);
			HttpEntity<String> requestEntity = new HttpEntity<String>(JSONUtils.serialize(params), headers);
			ResponseEntity<String> responseEntity = restTemplate.postForEntity("http://119.62.102.75:8881/api/authorize", requestEntity, String.class);
			RestResponse response = JSONUtils.deserialize(responseEntity.getBody(), RestResponse.class);
			System.out.println(JSONUtils.serialize(response));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
