package com.lenovohit.bdrp.tools.security.impl;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.lenovohit.bdrp.tools.security.SecurityHandle;

@Component("SecurityHandle")
public class TestSecurityHandleImpl implements SecurityHandle{

	@Override
	public String genRandom(int count, String salt) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String genCheckCode(String type, String sed, int length, long validInTime, Map<String, ?> params) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean verifyCheckCode(String type, String sed, String code, int length, long validInTime,
			Map<String, ?> params) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String encryptPin(String type, String sed, String plain, Map<String, ?> params) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String decryptPin(String type, String sed, String patterned, Map<String, ?> params) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean verifyPin(String type, String sed, String target, String patterned, Map<String, ?> params) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String encryptData(String type, String sed, String plain, String masterKeyName, Map<String, ?> params) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String decryptData(String type, String sed, String patterned, String masterKeyName, Map<String, ?> params) {
		// TODO Auto-generated method stub
		return null;
	}

}
