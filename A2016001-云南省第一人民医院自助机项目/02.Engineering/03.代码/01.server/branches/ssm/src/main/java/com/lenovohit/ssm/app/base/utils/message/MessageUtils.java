//package com.lenovohit.ssm.app.base.utils.message;
//
//
//
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import com.lenovohit.core.exception.BaseException;
//import com.lenovohit.core.utils.StringUtils;
//
///**
// * 文件上传工具类
// * 
// * @author yangdc
// * @date Apr 18, 2015
// * 
// *       <pre>
// *       </pre>
// */
//@Component
//public class MessageUtils {
//
//	// 短信服务器地址
//	public static String MESSAGE_URL;
//	// 短信服务器端口
//	public static String MESSAGE_PORT;
//	// 短信服务账户
//	public static String MESSAGE_ACCOUNT_SID;
//	// 短信服务TOKEN
//	public static String MESSAGE_AUTH_TOKEN;
//	// 短信服务对应应用
//	public static String MESSAGE_APPID;
//	// 业务对应短信模板
//	private static Map<String, String> MESSAGE_TYPE_TEMP_MAP = new HashMap<String, String>();
//	private static Map<String, String> MESSAGE_TYPE_PARAMS_MAP = new HashMap<String, String>();
//	// 短信SDK实例
////	public static CCPRestSmsSDK RESTAPI;
//
////	static {
////		Properties p = null;
////		try {
////			p = PropertiesLoaderUtils.loadAllProperties("application-config-el-base.properties");
////
////			MESSAGE_URL = p.getProperty("message.url");
////			MESSAGE_PORT = p.getProperty("message.port");
////			MESSAGE_ACCOUNT_SID = p.getProperty("message.account.sid");
////			MESSAGE_AUTH_TOKEN = p.getProperty("message.auth.token");
////			MESSAGE_APPID = p.getProperty("message.appid");
////
////			String typeTempStr = p.getProperty("message.type-temp");
////			String[] typeTempArr = null;
////			String[] typeTemp = null;
////			if (StringUtils.isNotBlank(typeTempStr)) {
////				typeTempArr = typeTempStr.split("\\|");
////				for (int i = 0; i < typeTempArr.length; i++) {
////					typeTemp = typeTempArr[i].split(":");
////					if (StringUtils.isNotBlank(typeTemp[0])) {
////						MESSAGE_TYPE_TEMP_MAP.put(typeTemp[0], typeTemp[1]);
////					}
////				}
////			}
////			String typeParamsStr = p.getProperty("message.type-params");
////			String[] typeParamsArr = null;
////			String[] typeParams = null;
////			if (StringUtils.isNotBlank(typeParamsStr)) {
////				typeParamsArr = typeParamsStr.split("\\|");
////				for (int i = 0; i < typeParamsArr.length; i++) {
////					typeParams = typeParamsArr[i].split(":");
////					if (StringUtils.isNotBlank(typeParams[0])) {
////						MESSAGE_TYPE_PARAMS_MAP.put(typeParams[0], typeParams[1]);
////					}
////				}
////			}
////
////		} catch (Exception e) {
////			e.printStackTrace();
////		}
////	}
//
//	/**
//	 * 文件上传
//	 * 
//	 * @throws IOException
//	 */
//	@SuppressWarnings("unchecked")
//	public static void sendMessage(String mobiles, String type, Map<String, String> params) throws BaseException {
//		try {
//			HashMap<String, Object> result = null;
//
//			// ******************************注释****************************************************************
//			// *调用发送模板短信的接口发送短信 *
//			// *参数顺序说明： *
//			// *第一个参数:是要发送的手机号码，可以用逗号分隔，一次最多支持100个手机号 *
//			// *第二个参数:是模板ID，在平台上创建的短信模板的ID值；测试的时候可以使用系统的默认模板，id为1。 *
//			// *系统默认模板的内容为“【云通讯】您使用的是云通讯短信模板，您的验证码是{1}，请于{2}分钟内正确输入”*
//			// *第三个参数是要替换的内容数组。 *
//			// **************************************************************************************************
//
//			// **************************************举例说明***********************************************************************
//			// *假设您用测试Demo的APP ID，则需使用默认模板ID
//			// 1，发送手机号是13800000000，传入参数为6532和5，则调用方式为 *
//			// *result = RESTAPI.sendTemplateSMS("13800000000","1" ,new
//			// String[]{"6532","5"}); *
//			// *则13800000000手机号收到的短信内容是：【云通讯】您使用的是云通讯短信模板，您的验证码是6532，请于5分钟内正确输入
//			// *
//
//			String tempId = "";
//			String paramKeys = "";
//			List<String> valuesList = new ArrayList<String>();
//			if (StringUtils.isBlank(mobiles)) {
//				throw new BaseException("发送短信错误，手机号为空！");
//			}
//			if (StringUtils.isBlank(type)) {
//				throw new BaseException("发送短信错误，业务码为空！");
//			} else {
//				tempId = MESSAGE_TYPE_TEMP_MAP.get(type);
//			}
//			if (MESSAGE_TYPE_PARAMS_MAP != null && StringUtils.isNotBlank(MESSAGE_TYPE_PARAMS_MAP.get(type))) {
//				paramKeys = MESSAGE_TYPE_PARAMS_MAP.get(type);
//				if (params == null || params.size() == 0) {
//					throw new BaseException("发送短信错误，传入参数为空，要求参数为：" + paramKeys);
//				}
//				for (String paramKey : paramKeys.split(",")) {
//					valuesList.add(params.get(paramKey));
//				}
//			}
//
////			result = getRESTAPI().sendTemplateSMS(mobiles, tempId, valuesList.toArray(new String[valuesList.size()]));
//
//			System.out.println("SDKTestGetSubAccounts result=" + result);
//			if ("000000".equals(result.get("statusCode"))) {
//				// 正常返回输出data包体信息（map）
//				HashMap<String, Object> data = (HashMap<String, Object>) result.get("data");
//				Set<String> keySet = data.keySet();
//				for (String key : keySet) {
//					Object object = data.get(key);
//					System.out.println(key + " = " + object);
//				}
//			} else {
//				// 异常返回输出错误码和错误信息
//				System.out.println("错误码=" + result.get("statusCode") + " 错误信息= " + result.get("statusMsg"));
//				throw new BaseException("发送短信错误，错误信息为：" + result.get("statusMsg"));
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BaseException("发送短信错误！");
//		}
//
//	}
//	
//	@Value("${app.message.url:app.cloopen.com}")
//	public void setMESSAGE_URL(String mESSAGE_URL) {
//		MESSAGE_URL = mESSAGE_URL;
//	}
//	
//	@Value("${app.message.port:8883}")
//	public void setMESSAGE_PORT(String mESSAGE_PORT) {
//		MESSAGE_PORT = mESSAGE_PORT;
//	}
//	
//	@Value("${app.message.account.sid:aaf98f89488747b2014887c30ad20077}")
//	public void setMESSAGE_ACCOUNT_SID(String mESSAGE_ACCOUNT_SID) {
//		MESSAGE_ACCOUNT_SID = mESSAGE_ACCOUNT_SID;
//	}
//	
//	@Value("${app.message.auth.token:b9d65053868344199f8562931ddc6903}")
//	public void setMESSAGE_AUTH_TOKEN(String mESSAGE_AUTH_TOKEN) {
//		MESSAGE_AUTH_TOKEN = mESSAGE_AUTH_TOKEN;
//	}
//	
//	@Value("${app.message.appid:aaf98f89488747b2014887ebfa9f00c4}")
//	public void setMESSAGE_APPID(String mESSAGE_APPID) {
//		MESSAGE_APPID = mESSAGE_APPID;
//	}
//	
//	@Value("${app.message.type-temp}")
//	public void setMESSAGE_TYPE_TEMP_MAP(String typeTempStr) {
//		String[] typeTempArr = null;
//		String[] typeTemp = null;
//		if (StringUtils.isNotBlank(typeTempStr)) {
//			typeTempArr = typeTempStr.split("\\|");
//			for (int i = 0; i < typeTempArr.length; i++) {
//				typeTemp = typeTempArr[i].split(":");
//				if (StringUtils.isNotBlank(typeTemp[0])) {
//					MESSAGE_TYPE_TEMP_MAP.put(typeTemp[0], typeTemp[1]);
//				}
//			}
//		}
//	}
//	
//	@Value("${app.message.type-params}")
//	public void setMESSAGE_TYPE_PARAMS_MAP(String typeParamsStr) {
//		String[] typeParamsArr = null;
//		String[] typeParams = null;
//		if (StringUtils.isNotBlank(typeParamsStr)) {
//			typeParamsArr = typeParamsStr.split("\\|");
//			for (int i = 0; i < typeParamsArr.length; i++) {
//				typeParams = typeParamsArr[i].split(":");
//				if (StringUtils.isNotBlank(typeParams[0])) {
//					MESSAGE_TYPE_PARAMS_MAP.put(typeParams[0], typeParams[1]);
//				}
//			}
//		}
//	}
//	
////	public static CCPRestSmsSDK getRESTAPI() {
////		if(null == RESTAPI){
////			// 初始化SDK
////			RESTAPI = new CCPRestSmsSDK();
////	
////			// ******************************注释*********************************************
////			// *初始化服务器地址和端口 *
////			// *沙盒环境（用于应用开发调试）：RESTAPI.init("sandboxapp.cloopen.com", "8883");*
////			// *生产环境（用户应用上线使用）：RESTAPI.init("app.cloopen.com", "8883"); *
////			// *******************************************************************************
////			RESTAPI.init(MESSAGE_URL, MESSAGE_PORT);
////	
////			// ******************************注释*********************************************
////			// *初始化主帐号和主帐号令牌,对应官网开发者主账号下的ACCOUNT SID和AUTH TOKEN *
////			// *ACOUNT SID和AUTH TOKEN在登陆官网后，在“应用-管理控制台”中查看开发者主账号获取*
////			// *参数顺序：第一个参数是ACOUNT SID，第二个参数是AUTH TOKEN。 *
////			// *******************************************************************************
////			RESTAPI.setAccount(MESSAGE_ACCOUNT_SID, MESSAGE_AUTH_TOKEN);
////	
////			// ******************************注释*********************************************
////			// *初始化应用ID *
////			// *测试开发可使用“测试Demo”的APP ID，正式上线需要使用自己创建的应用的App ID *
////			// *应用ID的获取：登陆官网，在“应用-应用列表”，点击应用名称，看应用详情获取APP ID*
////			// *******************************************************************************
////			RESTAPI.setAppId(MESSAGE_APPID);
////		}
////		return RESTAPI;
////	}
////	
//	
//
//}
