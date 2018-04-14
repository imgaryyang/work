package com.lenovohit.hwe.mobile.weixin.web.rest;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.hwe.mobile.core.web.rest.MobileBaseRestController;
import com.lenovohit.hwe.mobile.weixin.configration.WeixinMpProperties;

@RestController
@RequestMapping("/hwe/weixin/common")
@EnableConfigurationProperties(WeixinMpProperties.class)
public class WeixinBaseRestController extends MobileBaseRestController{
	
}
