package com.lenovohit.mnis.base.manager;

public interface ICommonRedisSequenceManager {
	/**
	 * 根据键值取编码
	 * @param key
	 * @return
	 */
	String get(String key);
}
