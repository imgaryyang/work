package com.lenovohit.hwe.base.manager.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.hwe.base.dao.ICommonRedisSequenceDao;
import com.lenovohit.hwe.base.manager.ICommonRedisSequenceManager;

public class CommonRedisSequenceManager implements ICommonRedisSequenceManager {
	
	@Autowired
	private ICommonRedisSequenceDao commonRedisSequenceDao;
	
	@Override
	public String get(String key) {
		return commonRedisSequenceDao.get(key);
	}

}
