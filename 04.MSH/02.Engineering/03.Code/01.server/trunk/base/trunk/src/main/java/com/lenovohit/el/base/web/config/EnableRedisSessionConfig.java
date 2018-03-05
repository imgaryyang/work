package com.lenovohit.el.base.web.config;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import com.lenovohit.bdrp.common.session.data.redis.serializer.BdrpRedisSeriaziler;

//@Configuration
//@EnableRedisHttpSession(maxInactiveIntervalInSeconds=2542000)
public class EnableRedisSessionConfig {
	
//	@PostConstruct
//	@Bean(name="springSessionDefaultRedisSerializer")
//	@Primary
	public BdrpRedisSeriaziler giveSerializer(){
		return new BdrpRedisSeriaziler();
	}
}
