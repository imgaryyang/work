package com.lenovohit.ssm.treat.dao;

import java.util.List;
import java.util.Map;

import org.apache.http.NameValuePair;

public interface PacsWebserviceDao {
	public  String postForEntity(String code, Object param, String reqXml) throws Exception;
	
	public List<String> postForList(String code, Object param, String reqXml) throws Exception;
	
	public  Map<String,Object> post(String code, Object param, String reqXml) throws Exception ;

	public String post(String code,List<NameValuePair> params, String reqXml)throws Exception ;
}
