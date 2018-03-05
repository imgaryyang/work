package com.lenovohit.hcp.base.manager.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.hcp.HCPConstants;
import com.lenovohit.hcp.base.configuration.RedisSequenceConfig;
import com.lenovohit.hcp.base.dao.ICommonRedisSequenceDao;
import com.lenovohit.hcp.base.dao.IRedisSequenceDao;
import com.lenovohit.hcp.base.manager.ICommonRedisSequenceManager;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.RedisSequence;

public class CommonRedisSequenceManager implements ICommonRedisSequenceManager {
	
	@Autowired
	private ICommonRedisSequenceDao commonRedisSequenceDao;
	
	@Override
	public String get(String key) {
		return commonRedisSequenceDao.get(key);
	}

}
