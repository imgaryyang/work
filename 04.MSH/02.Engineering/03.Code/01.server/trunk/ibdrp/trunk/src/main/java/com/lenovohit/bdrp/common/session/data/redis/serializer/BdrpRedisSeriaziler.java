package com.lenovohit.bdrp.common.session.data.redis.serializer;

import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.lenovohit.core.utils.JSONUtils;

/**
 * 声明为：springSessionDefaultRedisSerializer
 * @author zhanggooleee
 *
 */
public class BdrpRedisSeriaziler extends JdkSerializationRedisSerializer {
	
	@Override
	public Object deserialize(byte[] json)  {
		
		if(null == json || json.length<1) return null;

		String jsonStr = new String(json);
		if(json[0] == -84){
			return super.deserialize(json);
		}
		
		return JSON.parse(jsonStr);
		
	}

	@Override
	public byte[] serialize(Object obj)  {
		if(null == obj) return "".getBytes();
		if(obj.getClass().getName().contains("java.lang")){
			return JSONUtils.toJSONBytes(obj);
		}
		if(obj.getClass().getName().startsWith("org.apache.shiro.web.util.SavedRequest")){
			return super.serialize(obj);
		}
//		if(obj.getClass().getName().contains("com.lenovohit")){
			return JSONUtils.toJSONBytes(obj,SerializerFeature.WriteClassName);
//		}
//		return super.serialize(obj);
	}
}
