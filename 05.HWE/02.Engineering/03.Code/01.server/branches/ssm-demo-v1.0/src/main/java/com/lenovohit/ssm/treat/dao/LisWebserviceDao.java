package com.lenovohit.ssm.treat.dao;

import java.util.List;
import java.util.Map;

import org.apache.http.NameValuePair;

public interface LisWebserviceDao {
	public  String postForEntity(String code, Object param ) throws Exception;
	
	public List<String> postForList(String code, Object param) throws Exception;
	
	public  Map<String,Object> post(String code, Object param) throws Exception ;

	public String post(String code,List<NameValuePair> params )throws Exception ;
}
