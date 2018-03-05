package com.lenovohit.hwe.weixin.web.rest;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.weixin.configration.WeixinMpProperties;

@RestController
@RequestMapping("/hwe/weixin/common")
@EnableConfigurationProperties(WeixinMpProperties.class)
public class WeixinBaseRestController extends OrgBaseRestController{
}
