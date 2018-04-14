package com.lenovohit.hwe.base.dao;

import com.lenovohit.hwe.base.model.Sequence;

public interface RedisSequenceDao {
	
	boolean add(Sequence sequence);
	
	boolean update(Sequence sequence);
	
	Sequence get(String keyId);
}
