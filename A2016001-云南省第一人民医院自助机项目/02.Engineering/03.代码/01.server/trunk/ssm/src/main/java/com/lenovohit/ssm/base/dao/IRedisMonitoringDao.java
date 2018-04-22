package com.lenovohit.ssm.base.dao;

import com.lenovohit.ssm.base.model.RedisMonitoring;

public interface IRedisMonitoringDao {
	
	boolean add(RedisMonitoring monitoring);
	
	boolean update(RedisMonitoring monitoring);
	
	RedisMonitoring get(String keyId);
}
