package com.lenovohit.mnis.base.manager.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.mnis.base.dao.ICommonRedisSequenceDao;
import com.lenovohit.mnis.base.manager.ICommonRedisSequenceManager;

public class CommonRedisSequenceManager implements ICommonRedisSequenceManager {
	
	@Autowired
	private ICommonRedisSequenceDao commonRedisSequenceDao;
	
	@Override
	public String get(String key) {
		return commonRedisSequenceDao.get(key);
	}

}
