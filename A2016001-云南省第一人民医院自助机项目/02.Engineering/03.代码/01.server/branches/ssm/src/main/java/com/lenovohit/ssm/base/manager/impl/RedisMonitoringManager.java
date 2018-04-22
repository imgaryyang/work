package com.lenovohit.ssm.base.manager.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import com.lenovohit.ssm.base.manager.IRedisMonitoringManager;

import redis.clients.jedis.Jedis;

public class RedisMonitoringManager implements IRedisMonitoringManager{

	@Resource
    private RedisTemplate<String,Object> redisTemplate;
	private Jedis jedis;
    public void set(String key, Object value) {
        ValueOperations<String,Object> vo = redisTemplate.opsForValue();
        vo.set(key, value);
    } 
    public Object get(String key) {
        ValueOperations<String,Object> vo = redisTemplate.opsForValue();
        return vo.get(key);
    }
	@Override
	public void setList(String key , List<String> list) {
		for(String str : list){
			jedis.rpush(key, str);
		}
	}
	@Override
	public List<String> getList(String key) {
//		List<String> list = jedis.lrange("machines");
		return null;
	}
	
}
