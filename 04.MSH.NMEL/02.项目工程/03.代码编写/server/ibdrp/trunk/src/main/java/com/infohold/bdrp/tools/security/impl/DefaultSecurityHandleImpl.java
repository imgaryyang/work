package com.infohold.bdrp.tools.security.impl;

import java.util.Map;

import org.apache.commons.lang3.RandomStringUtils;

import com.infohold.bdrp.tools.security.SecurityHandle;

public class DefaultSecurityHandleImpl implements SecurityHandle {


	@Override
	public String genRandom(int count, String type) {
		return RandomStringUtils.randomAlphanumeric(count);
	}

	@Override
	public String genCheckCode(String type, String sed, int length, long validInTime, Map<String, ?> params) {
		return RandomStringUtils.randomAlphanumeric(length);
	}

	@Override
	public boolean verifyCheckCode(String type, String sed, String code, int length, long validInTime,
			Map<String, ?> params) {
		return true;
	}

	@Override
	public String encryptPin(String type, String sed, String plain, Map<String, ?> params) {
		return plain;
	}

	@Override
	public String decryptPin(String type, String sed, String patterned, Map<String, ?> params) {
		return patterned;
	}

	@Override
	public boolean verifyPin(String type, String sed, String target, String patterned, Map<String, ?> params) {
		return true;
	}

	@Override
	public String encryptData(String type, String sed, String plain, String masterKeyName, Map<String, ?> params) {
		return plain;
	}

	@Override
	public String decryptData(String type, String sed, String patterned, String masterKeyName, Map<String, ?> params) {
		return patterned;
	}

}
