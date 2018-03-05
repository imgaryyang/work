package com.lenovohit.bdrp.tools.security;

import java.util.Map;

public interface SecurityHandle {
	/**
	 * 获取随机字符串
	 * @param count 随机字符个股数
	 * @param salt 种子
	 * @return 随机字符串
	 */
	public String genRandom(int count, String salt);
	
	/**
	 * 生成验证码
	 * @param type 验证码类型
	 * @param sed 因子
	 * @param count 验证码字符数
	 * @param validInTime 有效时间
	 * @param params 扩展参数集合
	 * @return 验证码字符串
	 */
	public String genCheckCode(String type, String sed, int count, long validInTime, Map<String, ?> params);
	
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
	public boolean verifyCheckCode(String type, String sed, String code, int count, long validInTime, Map<String, ?> params);
	
	/**
	 * pin加密
	 * @param type 加密类型
	 * @param sed 加密因子
	 * @param plain pin原文
	 * @param params 扩展参数集合
	 * @return 加密结果
	 */
	public String encryptPin(String type, String sed, String plain, Map<String, ?> params);
	
	/**
	 * pin解密
	 * @param type 加密类型
	 * @param sed 解密因子
	 * @param patterned 密文
	 * @param params 扩展参数集合
	 * @return 解密结果
	 */
	public String decryptPin(String type, String sed, String patterned, Map<String, ?> params);
	
	/**
	 * pin校验
	 * @param type 加密类型
	 * @param sed 加密因子
	 * @param target 待检验pin
	 * @param patterned pin密文
	 * @param params 扩展参数集合
	 * @return 校验结果
	 */
	public boolean verifyPin(String type, String sed,String target, String patterned, Map<String, ?> params);
	
	/**
	 * 数据加密
	 * @param type 加密类型
	 * @param sed 加密因子
	 * @param plain 原数据
	 * @param masterKeyName 主密钥 
	 * @param params 扩展参数集合
	 * @return 加密结果
	 */
	public String encryptData(String type, String sed, String plain, String masterKeyName, Map<String, ?> params);
	
	/**
	 * 数据解密
	 * @param type 解密类型
	 * @param sed 解密因子
	 * @param patterned 加密数据
	 * @param masterKeyName 主密钥
	 * @param params 扩展参数集合
	 * @return 解密结果
	 */
	public String decryptData(String type, String sed, String patterned, String masterKeyName, Map<String, ?> params);
}
