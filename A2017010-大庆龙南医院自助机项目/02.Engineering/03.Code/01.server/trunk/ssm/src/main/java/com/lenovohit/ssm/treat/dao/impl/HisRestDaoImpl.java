package com.lenovohit.ssm.treat.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.dao.RestResponse;

public class HisRestDaoImpl implements HisRestDao {
	private final Logger log = LoggerFactory.getLogger(this.getClass());

	private String location;
	private String postUrl;

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
		Long start = System.currentTimeMillis();
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
			List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
			acceptableMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
			headers.setAccept(acceptableMediaTypes);
			HttpEntity<String> requestEntity = new HttpEntity<String>(JSONUtils.serialize(request), headers);
			String url = null;
			if(StringUtils.equals(RestRequest.SEND_TYPE_POST, request.getSendType())){
				url = postUrl;
			} else {
				url = location;
			}
			String uuid = com.lenovohit.core.utils.StringUtils.uuid();
			log.info(uuid+" HisRequest: URL 【" + url + "】");
			log.info(uuid+" HisRequest: Code【" + request.getCode() + "】");
			log.info(uuid+" HisRequest: param【" + JSONUtils.serialize(request.getParam()) + "】");
			
			ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, requestEntity, String.class);
			
			RestResponse response = JSONUtils.deserialize(responseEntity.getBody(), RestResponse.class);
			
			log.info(uuid+" HisRequest: response 【" + JSONUtils.serialize(response) + "】");
			Long end = System.currentTimeMillis();
			log.info(uuid+" HisRequest: COST 【" +request.getCode() +" : "+(end-start)+ "】");
			return response;
		} catch (Exception e) {
			 log.error(" HisRestDao exception:", e);
			 e.printStackTrace();
			// TODO: handle exception
		}
		return null;
	}

//	log.info(responseEntity.getBody());
//	
//	log.info("CONTENT : "+response.getContent());
//	log.info("RESUST : "+response.getResult());
//	log.info("RESULTcODE : "+response.getResultcode());
//	
////	HisDepartment dept =  JSONUtils.deserialize(response.getContent(), HisDepartment.class);
////	log.info("deptname : "+dept.getName());
//	List<HisDepartment> list = JSONUtils.parseObject(response.getContent(),new TypeReference<List<HisDepartment>>(){});
//	log.info("deptname : "+list.get(0).getName());
//	String small = JSONUtils.serialize(list.get(0));
//	log.info("dept  : "+small);
//	//log.info("deptSeized  : "+JSONUtils.parseObject(list.get(0)));
//	log.info("************************************");
//	return null;

}
