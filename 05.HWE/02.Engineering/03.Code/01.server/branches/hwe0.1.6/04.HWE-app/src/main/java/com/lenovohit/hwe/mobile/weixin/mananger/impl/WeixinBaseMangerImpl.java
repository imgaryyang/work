package com.lenovohit.hwe.mobile.weixin.mananger.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.hwe.mobile.weixin.configration.WeixinMpProperties;
import com.lenovohit.hwe.mobile.weixin.mananger.WeixinBaseManger;
import com.lenovohit.hwe.mobile.weixin.model.WeixinToken;


@Component("weixinBaseManger")
@EnableConfigurationProperties(WeixinMpProperties.class)
public class WeixinBaseMangerImpl implements WeixinBaseManger {
	@Autowired
	private WeixinMpProperties properties;

	private RestTemplate rest = new RestTemplate();

	@Override
	public WeixinToken getToken(String code) {
		String APPID = properties.getAppid();
		String SECRET = properties.getSecret();
		String grant_type = "authorization_code";
		String url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + APPID + "&secret=" + SECRET
				+ "&code="+code+"&grant_type=" + grant_type;
		ResponseEntity<String> entity = rest.getForEntity(url, String.class);
		System.out.println("WeixinToken ResponseEntity : "+ entity.getBody());
		WeixinToken token = JSONUtils.deserialize(entity.getBody(), WeixinToken.class);
		return token;
	}

}
