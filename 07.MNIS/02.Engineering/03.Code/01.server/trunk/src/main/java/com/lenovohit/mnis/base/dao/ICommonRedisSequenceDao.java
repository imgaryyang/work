package com.lenovohit.mnis.base.dao;

public interface ICommonRedisSequenceDao {

	boolean add(String key, String value);
	
	boolean update(String key, String value);
	
	String get(String key);

}
