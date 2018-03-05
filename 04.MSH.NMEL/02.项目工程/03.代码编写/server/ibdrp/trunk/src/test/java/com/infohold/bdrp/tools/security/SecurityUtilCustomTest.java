package com.infohold.bdrp.tools.security;

import org.junit.Test;
import org.springframework.util.Assert;

import com.infohold.bdrp.ApplicationTests;

public class SecurityUtilCustomTest extends ApplicationTests{
	
	@Test
	public void testGenRandom() {
		String randoCode = SecurityUtil.genRandom(16);
		System.out.println(randoCode);
		Assert.notNull(randoCode);
	}
}
