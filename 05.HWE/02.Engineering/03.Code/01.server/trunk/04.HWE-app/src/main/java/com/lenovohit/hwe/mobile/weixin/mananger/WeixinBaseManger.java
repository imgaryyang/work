package com.lenovohit.hwe.mobile.weixin.mananger;

import com.lenovohit.hwe.mobile.weixin.model.WeixinToken;

public interface WeixinBaseManger {
	public WeixinToken getToken(String code);
}
