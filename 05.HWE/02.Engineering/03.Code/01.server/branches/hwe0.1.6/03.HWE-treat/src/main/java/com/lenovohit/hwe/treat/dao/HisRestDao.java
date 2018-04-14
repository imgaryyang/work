package com.lenovohit.hwe.treat.dao;

public interface HisRestDao {

	public HisRestEntityResponse postForEntity(String code, String sendType, Object param) ;

	public HisRestListResponse postForList(String code, String sendType, Object param) ;

	public HisRestEntityResponse postForEntity(HisRestRequest request);

	public HisRestListResponse postForList(HisRestRequest request);

	public HisRestResponse post(HisRestRequest request);
}
