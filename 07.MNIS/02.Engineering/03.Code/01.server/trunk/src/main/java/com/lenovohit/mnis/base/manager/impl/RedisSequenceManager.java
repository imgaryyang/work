package com.lenovohit.mnis.base.manager.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.mnis.MnisConstants;
import com.lenovohit.mnis.base.configuration.RedisSequenceConfig;
import com.lenovohit.mnis.base.dao.IRedisSequenceDao;
import com.lenovohit.mnis.base.manager.IRedisSequenceManager;
import com.lenovohit.mnis.base.model.RedisSequence;

public class RedisSequenceManager implements IRedisSequenceManager {
	
	@Autowired
	private IRedisSequenceDao redisSequenceDao;
	
	@Override
	public String get(String tableName, String colName) {
		String key = tableName + "_" + colName;
		RedisSequenceConfig config = MnisConstants.SEQUENCE_RULE.get(key);
		if (null != config) {
			RedisSequence rs = redisSequenceDao.get(key);
			if (RedisSequenceConfig.SEQ_TYPE_FIXED_STRING == config.getType() || RedisSequenceConfig.SEQ_TYPE_DATE_STRING == config.getType())
				return rs.getSeqStr();
		}
		return null;
	}
	
	@Override
	public RedisSequence getSeq(String tableName, String colName) {
		String key = tableName + "_" + colName;
		RedisSequenceConfig config = MnisConstants.SEQUENCE_RULE.get(key);
		if (null != config) {
			RedisSequence rs = redisSequenceDao.get(key);
			return rs;
		}
		return null;
	}

}
