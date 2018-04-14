package com.lenovohit.hwe.mobile.zfb.mananger;

import com.lenovohit.hwe.mobile.zfb.model.ZfbToken;

public interface ZfbBaseManger {
	public ZfbToken getToken(String auth_code);
}
