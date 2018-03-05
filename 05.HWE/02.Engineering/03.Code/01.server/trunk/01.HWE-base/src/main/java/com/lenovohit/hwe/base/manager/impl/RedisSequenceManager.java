package com.lenovohit.hwe.base.manager.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.hwe.base.configuration.RedisSequenceConfig;
import com.lenovohit.hwe.base.dao.IRedisSequenceDao;
import com.lenovohit.hwe.base.manager.IRedisSequenceManager;
import com.lenovohit.hwe.base.model.RedisSequence;
import com.lenovohit.hwe.base.utils.SeqConstants;

public class RedisSequenceManager implements IRedisSequenceManager {
	
	@Autowired
	private IRedisSequenceDao redisSequenceDao;
	
	@Override
	public String get(String tableName, String colName) {
		String key = tableName + "_" + colName;
		RedisSequenceConfig config = SeqConstants.SEQUENCE_RULE.get(key);
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
		RedisSequenceConfig config = SeqConstants.SEQUENCE_RULE.get(key);
		if (null != config) {
			RedisSequence rs = redisSequenceDao.get(key);
			return rs;
		}
		return null;
	}

}
