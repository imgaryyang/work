package com.infohold.bdrp.tools.security;

import org.junit.Test;
import org.springframework.util.Assert;

public class SecurityUtilDefaultTest {
	
	@Test
	public void testGenRandom() {
		String randoCode = SecurityUtil.genRandom(16);
		System.out.println(randoCode);
		Assert.notNull(randoCode);
	}
}
