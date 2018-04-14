package com.lenovohit.hwe.base.utils;

import java.util.HashMap;
import java.util.Map;

import com.lenovohit.hwe.base.configuration.RedisSequenceConfig;

public class SeqConstants {
	public static String HCP_SESSION_USER_KEY = "ssm_machine";

	public final static Map<String, RedisSequenceConfig> SEQUENCE_RULE = new HashMap<String, RedisSequenceConfig>() {
		private static final long serialVersionUID = 1L;
		{
			put("PAY_BILL_BILL_NO", 				new RedisSequenceConfig(RedisSequenceConfig.SEQ_TYPE_DATE_STRING, "O", 4)); 	//医院id：		H 0001
		}
	};
}
