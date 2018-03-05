package com.lenovohit.hcp.base.dao;

import com.lenovohit.hcp.base.configuration.RedisSequenceConfig;
import com.lenovohit.hcp.base.model.RedisSequence;

public interface IRedisSequenceDao {
	
	boolean add(RedisSequence seq);
	
	boolean update(RedisSequence seq);
	
	RedisSequence get(String keyId);
}
