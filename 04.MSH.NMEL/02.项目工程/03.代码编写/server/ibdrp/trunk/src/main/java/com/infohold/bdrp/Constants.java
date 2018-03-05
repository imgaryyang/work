package com.infohold.bdrp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 应用中要用到的常量.
 * 
 *
 */
@Component("BdrpConstants")
public class Constants {

	/**
	 * The name of the ResourceBundle used in this application
	 */
	public static final String BUNDLE_KEY = "ApplicationResources";

	/**
	 * File separator from System properties
	 */
	public static final String FILE_SEP = System.getProperty("file.separator");

	/**
	 * User home from System properties
	 */
	public static final String USER_HOME = System.getProperty("user.home") + FILE_SEP;

	public static final String USER_LOGIN_KEY = "_userLoginKey";

	public static final String USER_KEY = "_userKey";

	public static final String ORG_KEY = "_orgKey";

	/**
	 * 应用级别的全局配置哈西表变量名.
	 */
	public static final String CONFIG = "appConfig";

	/**
	 * 样式表.
	 */
	public static final String CSS_THEME = "csstheme";

	/**
	 * 工程路径
	 */
	public static final String APP_PATH = "appPath";
	
	/**
	 * 超级管理员密码
	 */
	public static String APP_SUPER_ID = "00000000000000000000000000000000";
	
	/**
	 * 超级管理员用户名
	 */
	public static String APP_SUPER_USERNAME = "system";
	
	/**
	 * 普通用户密码
	 */
	public static String APP_USER_DEFAULT_PASSWORD = "123456";
	
	/**
	 * 超级管理员密码
	 */
	public static String APP_SUPER_PASSWORD = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";
	
	@Value("${app.system.user.username:system}")
	public void setAPP_SUPER_USERNAME(String aPP_SUPER_USERNAME) {
		APP_SUPER_USERNAME = aPP_SUPER_USERNAME;
	}
	
	
	@Value("${app.system.user.password:8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92}")
	public void setAPP_SUPER_PASSWORD(String aPP_SUPER_PASSWORD) {
		APP_SUPER_PASSWORD = aPP_SUPER_PASSWORD;
	}

	@Value("${app.system.user.id:00000000000000000000000000000000}")
	public void setAPP_SUPER_ID(String aPP_SUPER_ID) {
		APP_SUPER_ID = aPP_SUPER_ID;
	}

	
	@Value("${app.user.default.password:123456}")
	public void setAPP_USER_DEFAULT_PASSWORD(String aPP_USER_DEFAULT_PASSWORD) {
		APP_USER_DEFAULT_PASSWORD = aPP_USER_DEFAULT_PASSWORD;
	}

}
