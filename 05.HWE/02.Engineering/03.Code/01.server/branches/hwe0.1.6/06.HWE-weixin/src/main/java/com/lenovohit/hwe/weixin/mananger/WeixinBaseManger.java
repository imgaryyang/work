package com.lenovohit.hwe.weixin.mananger;

import com.lenovohit.hwe.weixin.model.WeixinToken;

public interface WeixinBaseManger {
	public WeixinToken getToken(String code);
}
