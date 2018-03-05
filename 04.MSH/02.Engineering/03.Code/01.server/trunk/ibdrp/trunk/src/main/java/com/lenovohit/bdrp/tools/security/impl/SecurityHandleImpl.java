package com.lenovohit.bdrp.tools.security.impl;

import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lenovohit.bdrp.tools.security.SecurityHandle;

@Service(value = "securityHandle")
public class SecurityHandleImpl implements SecurityHandle {

	protected transient final Log log = LogFactory.getLog(getClass());

	@Value("${app.security.connnect.host:110.76.186.49:2181}")
	private String host = "110.76.186.49:2181";

	@Value("${app.security.connnect.appId:YM}")
	private String appId = "YM";

	@Value("${app.security.connnect.timeout:8000}")
	private int timeout = 8000;
	
	@Value("${app.security.zpkName:YM.00.zpk}")
	private String zpkName = "YM.00.zpk";
	
	@Value("${app.security.pvkName:YM.00.pvk}")
	private String pvkName = "YM.00.pvk";
	
	@Value("${app.security.test:true}")
	private boolean isTest = true;
	
	@Value("${app.security.account.acctual:0000000000000000000000}")
	private String testAcctualAccount = "0000000000000000000000";
	
	@Value("${app.security.account.virtual:0000000000000000000000}")
	private String testVirtualAccount = "0000000000000000000000";

	@Override
	public String genRandom(int count, String sed) {/*
		String randomNum = null;
		try {
			handle.openHandle();
			randomNum = pwdApi.InfoholdAuthInit(16);
		} catch (Exception e) {
			log.error(e);
		}
		return randomNum;
	*/
		return null;
		}

	@Override
	public String genCheckCode(String type, String sed, int count, long validInTime, Map<String, ?> params) {/*
		String checkCode = null;
		try {
			handle.openHandle();
			checkCode = otpApi.lenovohitGenSMSCodeBytime(sed, count, 6, 10);
		} catch (Exception e) {
			log.error(e);
		}
		return checkCode;
	*/
		return null;
		}

	@Override
	public boolean verifyCheckCode(String type, String sed, String code, int count, long validInTime,
			Map<String, ?> params) {/*
		boolean isValid = false;
		try {
			handle.openHandle();
			isValid = otpApi.lenovohitVerSMSCodeBytime(sed, code, count, 6, 10);
		} catch (Exception e) {
			log.error(e);
		}
		return isValid;
	*/
		return false;
		}

	@Override
	public String encryptPin(String type, String sed, String plain, Map<String, ?> params) {/*
		String result = null;
		if (SecurityConstants.PIN_TYPE_LOGIN.equals(type)) {
			try {
				handle.openHandle();
				result = pwdApi.InfoholdTransLoginPwd(sed, plain, params.get(SecurityConstants.PARAM_KEY_LONIN_RANDOM).toString());
			} catch (Exception e) {
				e.printStackTrace();
				log.error(e);
			}
		} else if (SecurityConstants.PIN_TYPE_PAY.equals(type)) {
			try {
				handle.openHandle();
				result = disposeApi.InfoholdGenPinOffset(plain, zpkName, pvkName, this.isTest?this.testAcctualAccount:params.get(SecurityConstants.PARAM_KEY_ACCTUAL_ACCOUNT).toString(),
						this.isTest?this.testVirtualAccount:params.get(SecurityConstants.PARAM_KEY_VIRTUAL_ACCOUNT).toString(), params.get(SecurityConstants.PARAM_KEY_PAY_RANDOM).toString());
			} catch (Exception e) {
				e.printStackTrace();
				log.error(e);
			}
		}

		return result;
	*/
		return null;
		}

	@Override
	public String decryptPin(String type, String sed, String patterned, Map<String, ?> params) {

		return null;
	}

	@Override
	public boolean verifyPin(String type, String sed, String target, String patterned, Map<String, ?> params) {/*

		boolean result = false;

		if (SecurityConstants.PIN_TYPE_LOGIN.equals(type)) {
			try {
				handle.openHandle();
				result = pwdApi.InfoholdVerifyLoginPwd(sed, target,
						params.get(SecurityConstants.PARAM_KEY_LONIN_RANDOM).toString(), patterned);
			} catch (Exception e) {
				log.error(e);
			}
		} else if (SecurityConstants.PIN_TYPE_PAY.equals(type)) {
			try {

				handle.openHandle();
				result = disposeApi.InfoholdVerifyPin(target, zpkName, pvkName, this.isTest?this.testAcctualAccount:params.get(SecurityConstants.PARAM_KEY_ACCTUAL_ACCOUNT).toString(),
						this.isTest?this.testVirtualAccount:sed, params.get(SecurityConstants.PARAM_KEY_PAY_RANDOM).toString(),
						patterned);
			} catch (Exception e) {
				log.error(e);
			}
		}

		return result;
	*/
		return false;
		}

	@Override
	public String encryptData(String type, String sed, String plain, String masterKeyName, Map<String, ?> params) {/*

		String[] result = null;
		try {
			handle.openHandle();
			result = cipherAPI.lenovohitEncUserData(sed, plain, Integer.valueOf(type), masterKeyName);
		} catch (Exception e) {
			log.error(e);
		}
		if (null != result && result.length == 2) {
			return result[0] + SecurityConstants.ARRAY_TOSTRING_SEP + result[1];
		} else {
			return null;
		}
	*/
		return null;
		}

	@Override
	public String decryptData(String type, String sed, String patterned, String masterKeyName, Map<String, ?> params) {
		String result = null;
		try {/*
			handle.openHandle();
			result = cipherAPI.lenovohitDecUserData(sed, patterned, Integer.valueOf(type), masterKeyName);
		*/} catch (Exception e) {
			log.error(e);
		}
		return result;
	}

}
