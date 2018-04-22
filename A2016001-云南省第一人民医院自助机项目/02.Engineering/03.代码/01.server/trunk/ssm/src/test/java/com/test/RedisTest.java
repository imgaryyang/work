package com.test;

import com.lenovohit.ssm.base.web.rest.MonitoringRestController;

import redis.clients.jedis.Jedis;

public class RedisTest {
	public static void main(String[] args) {
		Jedis jedis = new Jedis("127.0.0.1");
		System.out.println("连接状态："+jedis.ping());
		
	}
}
