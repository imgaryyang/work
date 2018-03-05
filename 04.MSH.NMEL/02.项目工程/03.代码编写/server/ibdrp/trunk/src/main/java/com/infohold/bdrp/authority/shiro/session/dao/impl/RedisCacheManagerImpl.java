package com.infohold.bdrp.authority.shiro.session.dao.impl;

import org.apache.shiro.cache.AbstractCacheManager;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Component;

//@Component("cacheManager")
public class RedisCacheManagerImpl extends AbstractCacheManager implements InitializingBean {
	
	private static final Logger log = LoggerFactory
			.getLogger(RedisCacheManagerImpl.class);
	
	@Autowired
	private RedisConnectionFactory connectionFactory;
	
	/**
	 * The wrapped Jedis instance.
	 */
	private RedisTemplate<Object, Object> redisTemplate;
	
	private RedisSerializer<Object> defaultSerializer = new JdkSerializationRedisSerializer();
	
	/**
	 * The Redis key prefix for the sessions
	 */
	@Value("${app.session.cache.redis.prefix:app:cache:}")
	private String keyPrefix = "app:cache:";
	
	@Override
	protected Cache<Object, Object> createCache(String name) throws CacheException {
		log.debug("获取名称为: " + name + " 的RedisCache实例");
		return new RedisCache<Object, Object>(redisTemplate,keyPrefix);
	}

	
	private void initRedisTemplate() {
		this.redisTemplate = new RedisTemplate<Object, Object>();
		this.redisTemplate.setKeySerializer(new StringRedisSerializer());
//		this.redisTemplate.setHashKeySerializer(new StringRedisSerializer());
		this.redisTemplate.setDefaultSerializer(this.defaultSerializer);
		this.redisTemplate.setConnectionFactory(connectionFactory);
		this.redisTemplate.afterPropertiesSet();
	}


	@Override
	public void afterPropertiesSet() throws Exception {
		this.initRedisTemplate();
	}
}
