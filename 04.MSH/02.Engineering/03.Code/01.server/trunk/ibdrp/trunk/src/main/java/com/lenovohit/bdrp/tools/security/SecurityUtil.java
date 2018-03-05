package com.lenovohit.bdrp.tools.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

import com.lenovohit.bdrp.tools.security.impl.DefaultSecurityHandleImpl;
import com.lenovohit.core.utils.SpringUtils;

/**
 * 通用身份、数据安全处理
 * 
 * @author Exorics
 *
 */
public class SecurityUtil {

	private SecurityHandle defaultSecurityHandle = new DefaultSecurityHandleImpl();

	private SecurityHandle securityHandle;

	private static SecurityUtil instance;

	private SecurityUtil() {
	}

	public static synchronized SecurityUtil getInstance() {
		if (null == instance) {
			instance = new SecurityUtil();
		}
		return instance;
	}

	private SecurityHandle getSecurityHandle() {
		
		if (null == this.securityHandle) {
			this.securityHandle = (SecurityHandle) SpringUtils.loadBeanByName("securityHandle");
			if (null == this.securityHandle) {
				this.securityHandle = this.defaultSecurityHandle;
			}
		}
		return this.securityHandle;
	}
	
	/**
	 * 获取随机字符串
	 * @param count 随机字符个股数
	 * @return 随机字符串
	 */
	public static String genRandom(int count) {
		return getInstance().getSecurityHandle().genRandom(count,null);
	}

	/**
	 * 获取随机字符串
	 * @param count 随机字符个股数
	 * @param salt 种子
	 * @return 随机字符串
	 */
	public static String genCheckCode(String type, String sed, int length, long validInTime, Map<String, ?> params) {
		return getInstance().getSecurityHandle().genCheckCode(type, sed, length, validInTime, params);
	}
	
	/**
	 * 生成验证码
	 * @param type 验证码类型
	 * @param sed 因子
	 * @param count 验证码字符数
	 * @param validInTime 有效时间
	 * @return 验证码字符串
	 */
	public static String genCheckCode(String type, String sed, int length, long validInTime) {
		return genCheckCode(type, sed, length, validInTime, null);
	}
	
	/**
	 * 校验验证码
	 * @param type 验证码类型
	 * @param sed 因子
	 * @param code 待检验验证码
	 * @param length 验证码字符数
	 * @param validInTime 有效时间
	 * @return 验证结果
	 */
	public static boolean verifyCheckCode(String type, String sed, String code, int length, long validInTime,
			Map<String, ?> params) {
		return getInstance().getSecurityHandle().verifyCheckCode(type, sed, code, length, validInTime, params);
	}
	
	/**
	 * 校验验证码
	 * @param type 验证码类型
	 * @param sed 因子
	 * @param code 待检验验证码
	 * @param length 验证码字符数
	 * @param validInTime 有效时间
	 * @param params 扩展参数集合
	 * @return 验证结果
	 */
	public static boolean verifyCheckCode(String type, String sed, String code, int length, long validInTime) {
		return verifyCheckCode(type, sed, code, length, validInTime, null);
	}
	
	/**
	 * pin加密
	 * @param type 加密类型
	 * @param sed 加密因子
	 * @param plain pin原文
	 * @param params 扩展参数集合
	 * @return 加密结果
	 */
	public static String encryptPin(String type, String sed, String plain, Map<String, ?> params) {
		return getInstance().getSecurityHandle().encryptPin(type, sed, plain, params);
	}
	
	/**
	 * pin解密
	 * @param type 加密类型
	 * @param sed 解密因子
	 * @param patterned 密文
	 * @param params 扩展参数集合
	 * @return 解密结果
	 */
	public static String decryptPin(String type, String sed, String patterned, Map<String, ?> params) {
		return getInstance().getSecurityHandle().decryptPin(type, sed, patterned, params);
	}
	
	/**
	 * pin校验
	 * @param type 加密类型
	 * @param sed 加密因子
	 * @param target 待检验pin
	 * @param patterned pin密文
	 * @param params 扩展参数集合
	 * @return 校验结果
	 */
	public static boolean verifyPin(String type, String sed, String target, String patterned, Map<String, ?> params) {
		return getInstance().getSecurityHandle().verifyPin(type, sed, target, patterned, params);
	}
	
	/**
	 * 数据加密
	 * @param type 加密类型
	 * @param sed 加密因子
	 * @param plain 原数据
	 * @param masterKeyName 主密钥 
	 * @param params 扩展参数集合
	 * @return 加密结果
	 */
	public static String encryptData(String type, String sed, String plain, String masterKeyName, Map<String, ?> params) {
		return getInstance().getSecurityHandle().encryptData(type, sed, plain, masterKeyName, params);
	}
	
	/**
	 * 数据解密
	 * @param type 解密类型
	 * @param sed 解密因子
	 * @param patterned 加密数据
	 * @param masterKeyName 主密钥
	 * @param params 扩展参数集合
	 * @return 解密结果
	 */
	public static String decryptData(String type, String sed, String patterned, String masterKeyName, Map<String, ?> params) {
		return getInstance().getSecurityHandle().decryptData(type, sed, patterned, masterKeyName, params);
	}
	
	/**
	 * 获取hash值，hash算法为:SHA-256
	 * @param strSrc 源字符串
	 * @return 处理结果
	 */
	public static String doHashSHA256(String strSrc) {
		return doHash(strSrc, "SHA-256");
	}
	
	/**
	 * 获取hash值
	 * @param strSrc 源字符串
	 * @param algorithm hash算法，如：SHA-256
	 * @return 运算结果
	 */
	public static String doHash(String strSrc, String algorithm) {
		MessageDigest md = null;
		String strDes = null;
		byte[] bt = strSrc.getBytes();
		try {
			md = MessageDigest.getInstance(algorithm);
			md.update(bt);
			strDes = bytes2Hex(md.digest()); // to HexString
		} catch (NoSuchAlgorithmException e) {
			return null;
		}
		return strDes;
	}
	
	/**
	 * 转换为十六进制
	 * @param bts 字节码
	 * @return 十六进制字符串
	 */
	public static String bytes2Hex(byte[] bts) {
		String des = "";
		String tmp = null;
		for (int i = 0; i < bts.length; i++) {
			tmp = (Integer.toHexString(bts[i] & 0xFF));
			if (tmp.length() == 1) {
				des += "0";
			}
			des += tmp;
		}
		return des;
	}

}
