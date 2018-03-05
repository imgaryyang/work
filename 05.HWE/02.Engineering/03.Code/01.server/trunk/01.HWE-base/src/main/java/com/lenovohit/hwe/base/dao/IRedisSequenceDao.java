package com.lenovohit.hwe.base.dao;

import com.lenovohit.hwe.base.model.RedisSequence;

public interface IRedisSequenceDao {
	
	boolean add(RedisSequence seq);
	
	boolean update(RedisSequence seq);
	
	RedisSequence get(String keyId);
}
