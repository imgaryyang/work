package com.lenovohit.hwe.mobile.zfb.web.rest;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.hwe.mobile.core.web.rest.MobileBaseRestController;
import com.lenovohit.hwe.mobile.weixin.configration.WeixinMpProperties;

@RestController
@RequestMapping("/hwe/zfb/common")
@EnableConfigurationProperties(WeixinMpProperties.class)
public class ZfbBaseRestController extends MobileBaseRestController{
}
