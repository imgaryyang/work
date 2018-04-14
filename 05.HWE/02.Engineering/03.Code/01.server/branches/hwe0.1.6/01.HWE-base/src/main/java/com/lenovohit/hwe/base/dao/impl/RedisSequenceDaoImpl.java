package com.lenovohit.hwe.base.dao.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.hwe.base.dao.RedisSequenceDao;
import com.lenovohit.hwe.base.model.Sequence;

public class RedisSequenceDaoImpl<K, V>  implements RedisSequenceDao {
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
	public boolean add(final Sequence sequence) {
		boolean result = redisTemplate.execute(new RedisCallback<Boolean>() {
			public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
				RedisSerializer<String> serializer = getRedisSerializer();
				byte[] key = serializer.serialize(sequence.getSeqCode());
				byte[] value = serializer.serialize(JSONUtils.toJSONString(sequence));
				return connection.setNX(key, value);
			}
		});
		return result;
	}

	/**
	 * 修改sequence项
	 */
	public boolean update(final Sequence sequence) {
		boolean result = redisTemplate.execute(new RedisCallback<Boolean>() {
			public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
				RedisSerializer<String> serializer = getRedisSerializer();
				byte[] key = serializer.serialize(sequence.getSeqCode());
				byte[] value = serializer.serialize(JSONUtils.toJSONString(sequence));
				connection.set(key, value);
				return true;
			}
		});
		return result;
	}

	/**
	 * 通过 key 获取 sequence
	 */
	public Sequence get(final String keyId) {
		Sequence result = redisTemplate.execute(new RedisCallback<Sequence>() {
			public Sequence doInRedis(RedisConnection connection) throws DataAccessException {
				RedisSerializer<String> serializer = getRedisSerializer();
				byte[] key = serializer.serialize(keyId);
				byte[] value = connection.get(key);
				if (value == null) { // key对应的序列不存在
					return null;
				}
				return JSONUtils.parseObject(value, Sequence.class);
			}
		});
		return result;
	}
}
