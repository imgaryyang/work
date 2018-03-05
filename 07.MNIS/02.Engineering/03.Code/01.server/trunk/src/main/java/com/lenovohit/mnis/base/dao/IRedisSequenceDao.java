package com.lenovohit.mnis.base.dao;

import com.lenovohit.mnis.base.model.RedisSequence;

public interface IRedisSequenceDao {
	
	boolean add(RedisSequence seq);
	
	boolean update(RedisSequence seq);
	
	RedisSequence get(String keyId);
}
