package com.lenovohit.ssm.treat.dao;

import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.dao.RestResponse;

public interface HisRestDao {

	public RestEntityResponse postForEntity(String code, String sendType, Object param) ;

	public RestListResponse postForList(String code, String sendType, Object param) ;

	public RestEntityResponse postForEntity(RestRequest request);

	public RestListResponse postForList(RestRequest request);

	public RestResponse post(RestRequest request);
}
