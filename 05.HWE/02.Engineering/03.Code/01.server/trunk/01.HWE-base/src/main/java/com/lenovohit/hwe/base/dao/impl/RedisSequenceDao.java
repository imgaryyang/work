package com.lenovohit.hwe.base.dao.impl;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.hwe.base.configuration.RedisSequenceConfig;
import com.lenovohit.hwe.base.dao.IRedisSequenceDao;
import com.lenovohit.hwe.base.model.RedisSequence;
import com.lenovohit.hwe.base.utils.SeqConstants;

public class RedisSequenceDao<K, V> /*extends AbstractBaseRedisDao<String, RedisSequence>*/ implements IRedisSequenceDao {
	
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
	public boolean add(final RedisSequence seq) {
		boolean result = redisTemplate.execute(new RedisCallback<Boolean>() {
			public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
				RedisSerializer<String> serializer = getRedisSerializer();
				byte[] key = serializer.serialize(seq.getKey());
				byte[] name = RedisSequenceConfig.SEQ_TYPE_DATE_STRING == seq.getConfig().getType() ? 
						serializer.serialize(seq.getDateSeq().toString()) : 
						serializer.serialize(seq.getSeq().toString());
				return connection.setNX(key, name);
			}
		});
		return result;
	}

	/**
	 * 修改sequence项
	 */
	public boolean update(final RedisSequence seq) {
		boolean result = redisTemplate.execute(new RedisCallback<Boolean>() {
			public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
				RedisSerializer<String> serializer = getRedisSerializer();
				byte[] key = serializer.serialize(seq.getKey());
				byte[] name = RedisSequenceConfig.SEQ_TYPE_DATE_STRING == seq.getConfig().getType() ? 
						serializer.serialize(seq.getDateSeq().toString()) : 
						serializer.serialize(seq.getSeq().toString());
				connection.set(key, name);
				return true;
			}
		});
		return result;
	}

	/**
	 * 通过 key 获取 sequence
	 */
	public RedisSequence get(final String keyId) {
		RedisSequence result = redisTemplate.execute(new RedisCallback<RedisSequence>() {
			public RedisSequence doInRedis(RedisConnection connection) throws DataAccessException {
				RedisSerializer<String> serializer = getRedisSerializer();
				byte[] key = serializer.serialize(keyId);
				byte[] value = connection.get(key);
				
				RedisSequenceConfig config = SeqConstants.SEQUENCE_RULE.get(keyId);

				// 数字型序列 或 定长字符串序列
				if (RedisSequenceConfig.SEQ_TYPE_NUMBER == config.getType() || RedisSequenceConfig.SEQ_TYPE_FIXED_STRING == config.getType()) {
					if (value == null) { // key对应的序列不存在
						RedisSequence rs = new RedisSequence(keyId, new BigDecimal(config.getStartWith()));
						add(rs);
						return rs;
					} else {
						String seq = serializer.deserialize(value);
						RedisSequence rs = new RedisSequence(keyId, new BigDecimal(Integer.parseInt(seq) + config.getStep()));
						update(rs);
						return rs;
					}
				// 日期型序列
				} else {
					if (value == null) { // key对应的序列不存在
						JSONObject dateSeq = new JSONObject();
						dateSeq.fluentPut(DateUtils.getCurrentDateStr("yyyyMMdd"), new BigDecimal(config.getStartWith()));
						RedisSequence rs = new RedisSequence(keyId, dateSeq);
						add(rs);
						return rs;
					} else {
						String seqStr = serializer.deserialize(value);
						JSONObject dateSeq = new JSONObject();
						try {
							dateSeq = JSONObject.parseObject(seqStr);
						} catch(ClassCastException e) {
							dateSeq = JSONObject.parseObject("{\"1\":0}");
						}
						String date = (String)(dateSeq.keySet().toArray()[0]);
						BigDecimal seq  = dateSeq.getBigDecimal(date);
						// Redis中存储的是当前日期
						if (date.equals(DateUtils.getCurrentDateStr("yyyyMMdd"))) {
							dateSeq.fluentPut(date, new BigDecimal(seq.intValue() + config.getStep()));
							RedisSequence rs = new RedisSequence(keyId, dateSeq);
							update(rs);
							return rs;
						// Redis中存储的不是当前日期，更新日期，从头开始
						} else {
							dateSeq = new JSONObject();
							dateSeq.fluentPut(DateUtils.getCurrentDateStr("yyyyMMdd"), new BigDecimal(config.getStartWith()));
							RedisSequence rs = new RedisSequence(keyId, dateSeq);
							update(rs);
							return rs;
						}
					}
				}
			}
		});
		return result;
	}
}
