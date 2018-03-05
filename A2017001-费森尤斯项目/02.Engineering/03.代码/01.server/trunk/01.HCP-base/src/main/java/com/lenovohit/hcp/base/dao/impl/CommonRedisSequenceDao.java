package com.lenovohit.hcp.base.dao.impl;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.hcp.HCPConstants;
import com.lenovohit.hcp.base.configuration.RedisSequenceConfig;
import com.lenovohit.hcp.base.dao.ICommonRedisSequenceDao;
import com.lenovohit.hcp.base.dao.IRedisSequenceDao;
import com.lenovohit.hcp.base.model.RedisSequence;

public class CommonRedisSequenceDao<K, V> implements ICommonRedisSequenceDao {
	
	@Autowired
	private RedisTemplate<K, V> redisTemplate;

	/**
	 * 设置redisTemplate
	 * 
	 * @param redisTemplate 
	 * the redisTemplate to set
	 */
	public void setRedisTemplate(RedisTemplate<K, V> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

	/**
	 * 获取 RedisSerializer
	 */
	public RedisSerializer<String> getRedisSerializer() {
		return redisTemplate.getStringSerializer();
	}

	/**
	 * 新增sequence项
	 */
	public boolean add(final String key, final String value) {
		boolean result = redisTemplate.execute(new RedisCallback<Boolean>() {
			public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
				return connection.setNX(key.getBytes(), value.getBytes());
			}
		});
		return result;
	}

	/**
	 * 修改sequence项
	 */
	public boolean update(final String key, final String value) {
		boolean result = redisTemplate.execute(new RedisCallback<Boolean>() {
			public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
				connection.set(key.getBytes(), value.getBytes());
				return true;
			}
		});
		return result;
	}

	/**
	 * 通过 key 获取 sequence
	 */
	public String get(final String key) {
		String result = redisTemplate.execute(new RedisCallback<String>() {
			public String doInRedis(RedisConnection connection) throws DataAccessException {
				RedisSerializer<String> serializer = getRedisSerializer();
				
				byte[] value = connection.get(key.getBytes());
				int seq = 1;

				if (value == null) { // key对应的序列不存在
					add(key, seq + "");
					return seq + "";
				} else {
					seq = Integer.parseInt(new String(value)) + 1;
					update(key, seq + "");
					return seq + "";
				}
			}
		});
		return result;
	}
}
