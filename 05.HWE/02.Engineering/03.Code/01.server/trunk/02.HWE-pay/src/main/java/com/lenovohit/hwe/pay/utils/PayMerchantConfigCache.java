package com.lenovohit.hwe.pay.utils;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;

import com.lenovohit.hwe.pay.model.PayMerchant;

public class PayMerchantConfigCache {
	private static Map<String, Configuration> configCache = new HashMap<String, Configuration>(); 	//Sequence载体容器
	
	public static Configuration getConfig(String key){
		return configCache.get(key);
	}
	public static Configuration getConfig(PayMerchant payMerchant){
		Configuration config = null;
		config = configCache.get(payMerchant.getId());
		if(config == null){
			try {
				config = new PropertiesConfiguration(payMerchant.getConfigFile());
				configCache.put(payMerchant.getId(), config);
			} catch (ConfigurationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return config;
	}
	
	public static void putConfig(String key, Configuration config){
		configCache.put(key, config);
	}
	
	public static void putConfig(String key, String configFile){
		Configuration config;
		try {
			config = new PropertiesConfiguration(configFile);
			configCache.put(key, config);
		} catch (ConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public static void putConfig(PayMerchant payMerchant){
		Configuration config;
		try {
			config = new PropertiesConfiguration(payMerchant.getConfigFile());
			configCache.put(payMerchant.getId(), config);
		} catch (ConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
