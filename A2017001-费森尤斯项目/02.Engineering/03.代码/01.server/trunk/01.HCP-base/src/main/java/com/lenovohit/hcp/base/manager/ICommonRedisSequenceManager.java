package com.lenovohit.hcp.base.manager;

import com.lenovohit.hcp.base.model.RedisSequence;

public interface ICommonRedisSequenceManager {
	/**
	 * 根据键值取编码
	 * @param key
	 * @return
	 */
	String get(String key);
}
