package com.infohold.bdrp.tools.security.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 安全加密相关常量定义
 * 
 * @author zhanggooleee
 *
 */
@Component
public class SecurityConstants {
	
	/**
	 * 验证码类型-手机短信
	 */
	public static String CHECKCODE_TYPE_SMS = "1";
	
	/**
	 * 验证码类型-图片
	 */
	public static String CHECKCODE_TYPE_IMG = "2";

	/**
	 * 数据类型-身份证
	 */
	public static String DATA_TYPE_ID = "1";
	
	/**
	 * 数据类型-手机号
	 */
	public static String DATA_TYPE_PHONE = "2";
	
	/**
	 * 数据类型-账号
	 */
	public static String DATA_TYPE_ACCOUNT = "3";
	
	/**
	 * 数据类型-金额
	 */
	public static String DATA_TYPE_AMOUNT = "4";
	
	/**
	 * 密码类型-登录
	 */
	public static String PIN_TYPE_LOGIN = "1";
	
	/**
	 * 密码类型-支付
	 */
	public static String PIN_TYPE_PAY = "2";
	
	/**
	 * 数据加密字符串中解密结果与hash串分隔符
	 */
	public static String ARRAY_TOSTRING_SEP = "_#__#_";
	
	
	/**
	 * 扩展参数-登录密码-随机字符串
	 */
	public static String PARAM_KEY_LONIN_RANDOM = "random4Login";
	
	/**
	 * 扩展参数-支付密码-随机字符串
	 */
	public static String PARAM_KEY_PAY_RANDOM = "random4Pay";
	
	/**
	 * 扩展参数-实账号
	 */
	public static String PARAM_KEY_ACCTUAL_ACCOUNT = "acctualAccount";
	
	/**
	 * 扩展参数-虚账号
	 */
	public static String PARAM_KEY_VIRTUAL_ACCOUNT = "virtualAccount";
	
	/**
	 * 登录密码客户端公钥modulus1
	 */
	public static String KEY_PUBLIC_MODULUS1 = "";
	
	/**
	 * 登录密码客户端公钥exponent1
	 */
	public static String KEY_PUBLIC_EXPONENT1 = "";
	
	/**
	 * 支付密码客户端公钥modulus2
	 */
	public static String KEY_PUBLIC_MODULUS2 = "";
	
	/**
	 * 支付密码客户端公钥exponent2
	 */
	public static String KEY_PUBLIC_EXPONENT2 = "";
	
	/**
	 * 数据加解密主密钥名称
	 */
	public static String KEY_MASTER_KEY_NAME = "";
	

	@Value("${app.security.public.modulus1:00be5f85374497aba6b3fb6cf1edfa22eedbb78e3187f5ad869e2b7413451f81978317f85a2b940abfecbf83fbfedc90a12a92cf17d9509f23fa46b0ff78b7b0c8928cec476417a95e683a50a26be8501f0f2bce3a129a942564daac2f3aa9722ea8efa508c767f84fc8d372f96b6641671b153c7b49eb11724da2f9b28ef41d0b294abcc31021196c30722c7e966808cd343ac0bd70b8183309da75264287ccdcedaf83c1a2db1a541b228f823b90c713 }")
	public void setKEY_PUBLIC_MODULUS1(String kEY_PUBLIC_MODULUS1) {
		KEY_PUBLIC_MODULUS1 = kEY_PUBLIC_MODULUS1;
	}
	
	@Value("${app.security.public.exponent1:010001}")
	public void setKEY_PUBLIC_EXPONENT1(String kEY_PUBLIC_EXPONENT1) {
		KEY_PUBLIC_EXPONENT1 = kEY_PUBLIC_EXPONENT1;
	}
	
	@Value("${app.security.public.modulus2:009918f733947ae3be85b3149f5c285f6a25b00ebf5903f40d8dc7b22505858b58424584155aca621194185308ce042389415c2684a40512a97bf9999cb0f90bb2c59194160122eb4cef4926f39fd9b0f42f95262ef089d8356ad2a087ec5ff28d662930f3c334dc149ccbc1d0732859adc4fc595fc7a1327c021b0b3498e347c0da032aa18310cd247e4a6bd0c9a636d9}")
	public void setKEY_PUBLIC_MODULUS2(String kEY_PUBLIC_MODULUS2) {
		KEY_PUBLIC_MODULUS2 = kEY_PUBLIC_MODULUS2;
	}
	
	@Value("${app.security.public.exponent2:010001}")
	public void setKEY_PUBLIC_EXPONENT2(String kEY_PUBLIC_EXPONENT2) {
		KEY_PUBLIC_EXPONENT2 = kEY_PUBLIC_EXPONENT2;
	}
	
	@Value("${app.security.master.key.name:YM.00.zek}")
	public void setKEY_MASTER_KEY_NAME(String kEY_MASTER_KEY_NAME) {
		KEY_MASTER_KEY_NAME = kEY_MASTER_KEY_NAME;
	} 
	
	

}
