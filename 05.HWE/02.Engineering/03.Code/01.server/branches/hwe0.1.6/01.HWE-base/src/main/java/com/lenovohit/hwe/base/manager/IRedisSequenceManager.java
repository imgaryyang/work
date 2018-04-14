package com.lenovohit.hwe.base.manager;

import com.lenovohit.hwe.base.model.RedisSequence;

public interface IRedisSequenceManager {
	/**
	 * 根据表名及字段名取编码
	 * @param tableName
	 * @param colName
	 * @return
	 */
	String get(String tableName, String colName);
	
	/**
	 * 根据表名及字段名取编码的RedisSequence对象
	 * @param tableName
	 * @param colName
	 * @return
	 */
	RedisSequence getSeq(String tableName, String colName);
}
