package com.lenovohit.bdrp.authority.shiro.session.dao.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.apache.shiro.util.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;

import com.lenovohit.bdrp.authority.model.AuthUser;

public class RedisCache<K, V> implements Cache<Object, Object> {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	/**
	 * The wrapped Jedis instance.
	 */
	private RedisTemplate<Object, Object> redisTemplate;

	/**
	 * The Redis key prefix for the sessions
	 */
	private String keyPrefix = "app:cache:";

	/**
	 * Returns the Redis session keys prefix.
	 * 
	 * @return The prefix
	 */
	public String getKeyPrefix() {
		return keyPrefix;
	}

	/**
	 * Sets the Redis sessions key prefix.
	 * 
	 * @param keyPrefix
	 *            The prefix
	 */
	public void setKeyPrefix(String keyPrefix) {
		this.keyPrefix = keyPrefix;
	}

	/**
	 * 通过一个JedisManager实例构造RedisCache
	 */
	public RedisCache(RedisTemplate<Object, Object> redisTemplate) {
		if (redisTemplate == null) {
			throw new IllegalArgumentException("Cache argument cannot be null.");
		}
		this.redisTemplate = redisTemplate;
	}

	/**
	 * Constructs a cache instance with the specified Redis manager and using a
	 * custom key prefix.
	 * 
	 * @param cache
	 *            The cache manager instance
	 * @param prefix
	 *            The Redis key prefix
	 */
	public RedisCache(RedisTemplate<Object, Object> cache, String prefix) {

		this(cache);

		// set the prefix
		this.keyPrefix = prefix;
	}
	
	private Object getKey(Object key){
		if( "*".equals(key.toString())){
			return this.keyPrefix;
		}
		
		if(key instanceof AuthUser){
			return this.keyPrefix + "user:" + ((AuthUser)key).getId();
		}
		if(key instanceof SimplePrincipalCollection){
			return this.keyPrefix + "user:" + ((AuthUser)((SimplePrincipalCollection)key).getPrimaryPrincipal()).getId();
		}
		return this.keyPrefix + "sessions:" + key.toString();
	}
	
	@Override
	public Object get(Object key){
		log.debug("根据key从Redis中获取对象 key [" + key + "]");

		if (key == null) {
			return null;
		} else {
			return this.redisTemplate.opsForValue().get(getKey(key));
//			byte[] rawValue = (byte[]) this.cache.boundValueOps(getByteKey(key)).get();
//			@SuppressWarnings("unchecked")
//			Session value = (Session) defaultSerializer.deserialize(rawValue);
//			return value;
		}
	

	}

	@Override
	public Object put(Object key, Object value) {
		log.debug("根据key从存储 key [" + key + "]");
		this.redisTemplate.opsForValue().set(getKey(key), value);
		return value;
	}

	@Override
	public Object remove(Object key) {
		log.debug("从redis中删除 key [" + key + "]");

		Object previous = get(getKey(key));
		this.redisTemplate.delete(getKey(key));
		return previous;
	
	}

	@Override
	public void clear() throws CacheException {
		this.redisTemplate.delete(getKey("*"));
		
//		redisTemplate.execute(new RedisCallback<String>() {  
//            public String doInRedis(RedisConnection connection)  
//                    throws DataAccessException {  
//                connection.flushDb();  
//                return "ok";  
//            }  
//        }); 
	}

	@Override
	public int size() {
		Long result = this.redisTemplate.opsForValue().size(this.getKey("*"));
		return Integer.parseInt(result.toString());
	}

	@Override
	public Set<Object> keys() {
		return this.redisTemplate.keys(this.getKey("*"));
	}

	@Override
	public Collection<Object> values() {
		Set<Object> keys = keys();
		if (!CollectionUtils.isEmpty(keys)) {
            List<Object> values = new ArrayList<Object>(keys.size());
            for (Object key : keys) {
            	Object value = this.redisTemplate.opsForValue().get(key);
                if (value != null) {
                    values.add(value);
                }
            }
            return Collections.unmodifiableList(values);
        } else {
            return Collections.emptyList();
        }
	}

}
