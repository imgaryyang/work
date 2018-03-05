package com.infohold.el.base.utils;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import com.infohold.el.ApplicationTests;
import com.infohold.el.base.utils.message.MessageUtils;

public class MessageUtilsTest extends ApplicationTests {

	@Test
	public void testSendMsg() {
		Map<String, String> params = new HashMap<String, String>();
		params.put("checkCode", "123456");
		params.put("time", "5");
		params.put("mobile", "18001261557");
		MessageUtils.sendMessage("15210237560", "20", params);
	}
}
