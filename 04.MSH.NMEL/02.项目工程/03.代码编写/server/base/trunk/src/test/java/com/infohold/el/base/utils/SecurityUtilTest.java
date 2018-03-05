package com.infohold.el.base.utils;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.junit.Test;
import org.springframework.util.Assert;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.tools.security.SecurityUtil;
import com.infohold.bdrp.tools.security.impl.SecurityConstants;
import com.infohold.core.utils.FileUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.el.ApplicationTests;

public class SecurityUtilTest extends ApplicationTests {

	private String random;
	private String checkCode;
	private String userId = Constants.APP_SUPER_ID;// MathUtils.uuid();
	private String loginPasswd = Constants.APP_USER_DEFAULT_PASSWORD;
	private String loginPasswdClientEnc;
	private String payPasswd = Constants.APP_USER_DEFAULT_PASSWORD;
	private String payPasswdClientEnc;
	private String loginPasswdHash;
	private String payPasswdHash;
	private String virAccount = "0000000000000000";
	private String ID = "330184198501184115";
	private String IDEnc;
	private String IDHash;
	private String phone = "18001329765";
	private String phoneEnc;
	private String phoneHash;
	private String acctEnc;
	private String acctHash;
	private double amount = 829303.01;
	private String amountEnc;
	private String amountHash;

	@Test
	public void testFlow() {
		testGenRandom();
		testGenCheckCode();
		tesetVerifyCheckCode();
		testClientEncryptLoginPasswd();
		testClientEncryptPayPasswd();
		testEncryptPin();
		testVerifyPin();
		testEncryptData();
		testDecryptData();
	}

	@Test
	public void testGetKeypaire() {
		log.info("modulus1:" + SecurityConstants.KEY_PUBLIC_MODULUS1);
		log.info("exponent1:" + SecurityConstants.KEY_PUBLIC_EXPONENT1);
		log.info("modulus2:" + SecurityConstants.KEY_PUBLIC_MODULUS2);
		log.info("exponent2:" + SecurityConstants.KEY_PUBLIC_EXPONENT2);
	}

	public void testGenRandom() {
		random = SecurityUtil.genRandom(16);
		Assert.notNull(random);
		log.info("生成随机码为：" + random);
	}

	public void testGenCheckCode() {
		/**
		 * 生成验证码
		 * 
		 * @param type
		 *            验证码类型
		 * @param sed
		 *            因子
		 * @param count
		 *            验证码字符数
		 * @param validInTime
		 *            有效时间
		 * @param params
		 *            扩展参数集合
		 * @return 验证码字符串
		 */
		checkCode = SecurityUtil.genCheckCode(SecurityConstants.CHECKCODE_TYPE_SMS, phone, 6, 60);
		Assert.notNull(checkCode);
		log.info("生成验证码为：" + checkCode);
	}

	public void tesetVerifyCheckCode() {
		/**
		 * 校验验证码
		 * 
		 * @param type
		 *            验证码类型
		 * @param sed
		 *            因子
		 * @param code
		 *            待检验验证码
		 * @param length
		 *            验证码字符数
		 * @param validInTime
		 *            有效时间
		 * @param params
		 *            扩展参数集合
		 * @return 验证结果
		 */

		boolean flag = SecurityUtil.verifyCheckCode(SecurityConstants.CHECKCODE_TYPE_SMS, phone, checkCode, 6, 60,
				null);
		log.info("验证码【" + checkCode + "】校验" + flag + "成功");
		flag = SecurityUtil.verifyCheckCode(SecurityConstants.CHECKCODE_TYPE_SMS, phone, "222222", 6, 60, null);
		Assert.isTrue(flag == false);
		log.info("验证码【000000】有效期内校验结果：" + flag);
	}

	public void testEncryptPin() {
		/**
		 * pin加密
		 * 
		 * @param type
		 *            加密类型
		 * @param sed
		 *            加密因子
		 * @param plain
		 *            pin原文
		 * @param params
		 *            扩展参数集合
		 * @return 加密结果
		 */
		Map<String, String> params = new HashMap<String, String>();
		params.put(SecurityConstants.PARAM_KEY_LONIN_RANDOM, this.random);

		loginPasswdHash = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_LOGIN, userId, loginPasswdClientEnc,
				params);
		log.info("用户【" + userId + "]的登录密码加密后为 " + loginPasswdHash);

		params.put(SecurityConstants.PARAM_KEY_PAY_RANDOM, this.random);
		payPasswdHash = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_PAY, virAccount, this.payPasswdClientEnc, params);
		log.info("用户【" + userId + "]的支付密码加密后为 " + payPasswdHash);
	}

	public void testDecryptPin() {
		/**
		 * pin解密
		 * 
		 * @param type
		 *            加密类型
		 * @param sed
		 *            解密因子
		 * @param patterned
		 *            密文
		 * @param params
		 *            扩展参数集合
		 * @return 解密结果
		 */
	}

	public void testVerifyPin() {
		/**
		 * pin校验
		 * 
		 * @param type
		 *            加密类型
		 * @param sed
		 *            加密因子
		 * @param target
		 *            待检验pin
		 * @param patterned
		 *            pin密文
		 * @param params
		 *            扩展参数集合
		 * @return 校验结果
		 */
		Map<String, String> params = new HashMap<String, String>();
		params.put(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);
		boolean result = SecurityUtil.verifyPin(SecurityConstants.PIN_TYPE_LOGIN, userId, this.loginPasswdClientEnc,
				this.loginPasswdHash, params);
		log.info("用户【" + userId + "】- 输入密码：【" + this.loginPasswdClientEnc + "】随机字符串【" + random + "】,存储密码为:【"
				+ this.loginPasswdHash + "】，登录密码校验结果：" + result);
		
		params.put(SecurityConstants.PARAM_KEY_PAY_RANDOM, random);
		
		//获取用户账户号
		result = SecurityUtil.verifyPin(SecurityConstants.PIN_TYPE_PAY,virAccount,this.payPasswdClientEnc, this.payPasswdHash, params);
		log.info("账号【" + virAccount + "】- 输入密码：【" + this.payPasswdClientEnc + "】随机字符串【" + random + "】,存储密码为:【"
				+ this.payPasswdHash + "】，支付密码校验结果：" + result);

	}

	public void testEncryptData() {
		/**
		 * 数据加密
		 * 
		 * @param type
		 *            加密类型
		 * @param sed
		 *            加密因子
		 * @param plain
		 *            原数据
		 * @param masterKeyName
		 *            主密钥
		 * @param params
		 *            扩展参数集合
		 * @return 加密结果
		 */
		String result = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_PHONE, userId, phone,
				SecurityConstants.KEY_MASTER_KEY_NAME, null);
		if (StringUtils.isNotEmpty(result)) {
			phoneEnc = result.split(SecurityConstants.ARRAY_TOSTRING_SEP)[0];
			phoneHash = result.split(SecurityConstants.ARRAY_TOSTRING_SEP)[1];
		}
		log.info("手机号【" + phone + "】加密后：" + phoneEnc + ",hash为：" + phoneHash);

		result = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_ID, userId, ID,
				SecurityConstants.KEY_MASTER_KEY_NAME, null);
		if (StringUtils.isNotEmpty(result)) {
			IDEnc = result.split(SecurityConstants.ARRAY_TOSTRING_SEP)[0];
			IDHash = result.split(SecurityConstants.ARRAY_TOSTRING_SEP)[1];
		}
		log.info("身份证号【" + ID + "】加密后：" + IDEnc + ",hash为：" + IDHash);

		result = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_ACCOUNT, userId, virAccount,
				SecurityConstants.KEY_MASTER_KEY_NAME, null);
		if (StringUtils.isNotEmpty(result)) {
			acctEnc = result.split(SecurityConstants.ARRAY_TOSTRING_SEP)[0];
			acctHash = result.split(SecurityConstants.ARRAY_TOSTRING_SEP)[1];
		}
		log.info("银行卡号【" + virAccount + "】加密后：" + acctEnc + ",hash为：" + acctHash);

		result = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_AMOUNT, userId, String.valueOf(amount),
				SecurityConstants.KEY_MASTER_KEY_NAME, null);
		if (StringUtils.isNotEmpty(result)) {
			amountEnc = result.split(SecurityConstants.ARRAY_TOSTRING_SEP)[0];
			// acctHash = result.split(SecurityConstants.ARRAY_TOSTRING_SEP)[1];
		}
		log.info("金额【" + amount + "】加密后：" + amountEnc + ",hash为：" + amountHash);

	}

	public void testDecryptData() {
		/**
		 * 数据解密
		 * 
		 * @param type
		 *            解密类型
		 * @param sed
		 *            解密因子
		 * @param patterned
		 *            加密数据
		 * @param masterKeyName
		 *            主密钥
		 * @param params
		 *            扩展参数集合
		 * @return 解密结果
		 */
		String result = SecurityUtil.decryptData(SecurityConstants.DATA_TYPE_PHONE, userId, phoneEnc,
				SecurityConstants.KEY_MASTER_KEY_NAME, null);
		log.info("手机号密文【" + phoneEnc + "】解密后：" + result);

		result = SecurityUtil.decryptData(SecurityConstants.DATA_TYPE_ID, userId, IDEnc,
				SecurityConstants.KEY_MASTER_KEY_NAME, null);
		log.info("身份证号密文【" + IDEnc + "】解密后：" + result);

		result = SecurityUtil.decryptData(SecurityConstants.DATA_TYPE_ACCOUNT, userId, acctEnc,
				SecurityConstants.KEY_MASTER_KEY_NAME, null);
		log.info("账号密文【" + acctEnc + "】解密后：" + result);

		result = SecurityUtil.decryptData(SecurityConstants.DATA_TYPE_AMOUNT, userId, amountEnc,
				SecurityConstants.KEY_MASTER_KEY_NAME, null);
		log.info("金额密文【" + amountEnc + "】解密后：" + result);

	}

	public void testClientEncryptLoginPasswd() {

		Map<String, String> params = new HashMap<String, String>();
		params.put(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);

		ScriptEngineManager sem = new ScriptEngineManager();
		ScriptEngine se = sem.getEngineByName("javascript");
		try {
			String rsa = FileUtils.readFileToString(new File(
					"/Users/zhanggooleee/Documents/prjs/epl-code/03.代码编写/server/ibdrp-web/src/main/webapp/static/scripts/utils/security.js"));
			rsa += ";var random = '" + random.trim() + "';";
			rsa += "var modulus='" + SecurityConstants.KEY_PUBLIC_MODULUS1.trim() + "', exponent='"
					+ SecurityConstants.KEY_PUBLIC_EXPONENT1.trim() + "';";
			rsa += "var modulus2='" + SecurityConstants.KEY_PUBLIC_MODULUS2.trim() + "', exponent2='"
					+ SecurityConstants.KEY_PUBLIC_EXPONENT1.trim() + "';";
			rsa += "var plained='" + this.loginPasswd + "';";
			rsa += "function encPswd() {return RSAUtils.encryptedPassword(random,plained,modulus, exponent);}";

			se.eval(rsa);
			Invocable invocableEngine = (Invocable) se;
			loginPasswdClientEnc = (String) invocableEngine.invokeFunction("encPswd");
			log.info("随机数：" + this.random + ",输入密码：" + this.loginPasswd + ",加密后：" + this.loginPasswdClientEnc);
			System.out.println(payPasswdClientEnc);
		} catch (ScriptException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public void testClientEncryptPayPasswd() {

		Map<String, String> params = new HashMap<String, String>();
		params.put(SecurityConstants.PARAM_KEY_PAY_RANDOM, random);

		ScriptEngineManager sem = new ScriptEngineManager();
		ScriptEngine se = sem.getEngineByName("javascript");
		try {
			String rsa = FileUtils.readFileToString(new File(
					"/Users/zhanggooleee/Documents/prjs/epl-code/03.代码编写/server/ibdrp-web/src/main/webapp/static/scripts/utils/security.js"));
			rsa += ";var random = '" + random.trim() + "';";
			rsa += "var modulus='" + SecurityConstants.KEY_PUBLIC_MODULUS1.trim() + "', exponent='"
					+ SecurityConstants.KEY_PUBLIC_EXPONENT1.trim() + "';";
			rsa += "var modulus2='" + SecurityConstants.KEY_PUBLIC_MODULUS2.trim() + "', exponent2='"
					+ SecurityConstants.KEY_PUBLIC_EXPONENT1.trim() + "';";
			rsa += "var plained='" + this.payPasswd + "';";
			rsa += "function encPswd() {return RSAUtils.encryptedPassword(random,plained,modulus2, exponent2,modulus, exponent);}";

			se.eval(rsa);
			Invocable invocableEngine = (Invocable) se;
			payPasswdClientEnc = (String) invocableEngine.invokeFunction("encPswd");
			log.info("随机数：" + this.random + ",输入密码：" + this.payPasswd + ",加密后：" + this.payPasswdClientEnc);
			System.out.println(payPasswdClientEnc);
		} catch (ScriptException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
