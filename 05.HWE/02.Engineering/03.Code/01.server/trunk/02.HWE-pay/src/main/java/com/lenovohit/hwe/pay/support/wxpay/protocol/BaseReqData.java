package com.lenovohit.hwe.pay.support.wxpay.protocol;

import org.apache.commons.configuration.Configuration;

import com.thoughtworks.xstream.annotations.XStreamOmitField;

/**
 * User: rizenguo
 * Date: 2014/10/25
 * Time: 16:42
 */
public class BaseReqData {
	
    //接口配置
	@XStreamOmitField
    private Configuration configs;

	public Configuration getConfigs() {
		return configs;
	}

	public void setConfigs(Configuration configs) {
		this.configs = configs;
	}
    
}
