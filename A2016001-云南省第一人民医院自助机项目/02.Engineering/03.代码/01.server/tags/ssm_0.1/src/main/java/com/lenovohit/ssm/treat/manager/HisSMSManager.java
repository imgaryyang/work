package com.lenovohit.ssm.treat.manager;

public interface HisSMSManager {
	/**
	 * 短信平台发送验证码	sms/verifyCode	post
	 * @param phoneNo
	 * @return
	 */
	String verifyCode(String phoneNo);
	/**
	 * 验证码校验	sms/verify	post
	 * @param phoneNo
	 * @param code
	 * @return
	 */
	boolean verify(String phoneNo,String code);
}
