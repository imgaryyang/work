//package com.lenovohit.ssm.app.base.utils.notice;
//
//
//
//
//import java.io.IOException;
//import java.util.HashMap;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//
//import com.lenovohit.core.exception.BaseException;
//import com.lenovohit.core.utils.StringUtils;
//
//
///**
// * 应用通知工具类
// * 
// * @author Zyus
// * @date 2016-07-13
// * 
// */
//@Component
//public class NoticeUtils {
//	
//	// 应用通知发送实例
//	private static Map<String, JPushClient> JPUSH_CLIENT_MAP = new HashMap<String, JPushClient>();
//
////	static {
////		Properties p = null;
////		try {
////			p = PropertiesLoaderUtils.loadAllProperties("application-config-el-base.properties");
////			String appKeysStr = p.getProperty("notice.app-key");
////			String[] appKeysArr = null;
////			String[] appKey = null;
////			String[] _appKey = null;
////			if(StringUtils.isNotBlank(appKeysStr)){
////				appKeysArr = appKeysStr.split("\\|");
////				for(int i=0; i<appKeysArr.length; i++){
////					appKey = appKeysArr[i].split(":");
////					if(StringUtils.isNotBlank(appKey[0]) && StringUtils.isNotBlank(appKey[1])){
////						_appKey = appKey[1].split(",");
////						JPUSH_CLIENT_MAP.put(appKey[0], new JPushClient( _appKey[1], _appKey[0]));
////					}
////				}
////			}
////		} catch (Exception e) {
////			e.printStackTrace();
////		}
////	}
//	
//	
//	/**
//	 * 文件上传
//	 * 
//	 * @throws IOException
//	 */
//	public static void sendNotice(String apps, String platform, String receiverType,
//			String receiverValue, String notification, String message,
//			String title, String content, boolean production,
//			Map<String, String> extraParams) throws BaseException {
//		try {
//			cn.jpush.api.push.model.PushPayload.Builder builder = PushPayload.newBuilder();
//			
//			setPlatform(builder, platform);
//			setAudience(builder, receiverType, receiverValue);
//			setNotification(builder, notification, title, content, extraParams);
//			setMessage(builder, message,  title, content, extraParams);
//			setOptions(builder, production, extraParams);
//			
//			for(String app : apps.split(",")){
//				if(StringUtils.isNotBlank(app) && null!=JPUSH_CLIENT_MAP.get(app)){
//					if(JPUSH_CLIENT_MAP.get(app).sendPushValidate(builder.build()).isResultOK())
//						JPUSH_CLIENT_MAP.get(app).sendPush(builder.build());
//				}
//			}
//
//		} catch (BaseException be) {
//			throw be;
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BaseException("发送应用通知错误！");
//		}
//	}
//	
//	/**
//	 * 配置Platform
//	 * 
//	 * @throws BaseException 
//	 */
//	private static void setPlatform(
//			cn.jpush.api.push.model.PushPayload.Builder builder, String platform) throws BaseException {
//		try {
//			if(StringUtils.isBlank(platform) 
//					|| (!platform.contains("all") && !platform.contains("android") && !platform.contains("ios") && !platform.contains("winphone"))){
//				platform = "all";
//			}
//			
//			cn.jpush.api.push.model.Platform.Builder pBuilder = Platform.newBuilder();
//			if(platform.contains("all")) {
//				pBuilder.setAll(true);
//			}
//			if(platform.contains("android")) {
//				pBuilder.addDeviceType(DeviceType.Android);
//			}
//			if(platform.contains("ios")) {
//				pBuilder.addDeviceType(DeviceType.IOS);
//			}
//			/*if(platform.contains("winphone")) {
//				pBuilder.addDeviceType(DeviceType.WinPhone).build();
//			}*/
//			
//			builder.setPlatform(pBuilder.build());
//		} catch (BaseException be) {
//			throw be;
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BaseException("发送应用通知，配置Platform错误！");
//		}
//	}
//	
//	/**
//	 * 配置Audience
//	 * 
//	 * @throws IOException 
//	 */
//	private static void setAudience(
//			cn.jpush.api.push.model.PushPayload.Builder builder,
//			String receiverType, String receiverValue) throws BaseException {
//		try {
//			if(StringUtils.isBlank(receiverType) 
//					|| (!receiverType.equals("0") && !receiverType.equals("1") && !receiverType.equals("2") )){
//				receiverType = "0";
//			}
//			
//			cn.jpush.api.push.model.audience.Audience.Builder aBuilder = Audience.newBuilder();
//			if(receiverType.equals("0")) {
//				aBuilder.setAll(true);
//			}
//			if(receiverType.equals("1")) {
//				aBuilder.addAudienceTarget(AudienceTarget.newBuilder()
//		                .setAudienceType(AudienceType.ALIAS)
//		                .addAudienceTargetValues(receiverValue.split(",")).build());
//			}
//			if(receiverType.equals("2")) {
//				aBuilder.addAudienceTarget(AudienceTarget.newBuilder()
//		                .setAudienceType(AudienceType.TAG)
//		                .addAudienceTargetValues(receiverValue.split(",")).build());
//			}
//			if(receiverType.equals("3")) {
//				aBuilder.addAudienceTarget(AudienceTarget.newBuilder()
//		                .setAudienceType(AudienceType.REGISTRATION_ID)
//		                .addAudienceTargetValues(receiverValue.split(",")).build());
//			}
//			
//			builder.setAudience(aBuilder.build());
//		} catch (BaseException be) {
//			throw be;
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BaseException("发送应用通知，配置Audience错误！");
//		}
//	}
//	
//	/**
//	 * 配置Notification
//	 * 
//	 * @throws BaseException 
//	 */
//	private static void setNotification(
//			cn.jpush.api.push.model.PushPayload.Builder builder,
//			String notification, String title, String content,
//			Map<String, String> extraParams) throws BaseException {
//		try {
//			if(StringUtils.isBlank(notification)){
//				notification = "all";
//			} 
//			if (!notification.contains("all")
//					&& !notification.contains("android")
//					&& !notification.contains("ios")
//					&& !notification.contains("winphone")){
//				throw new BaseException("发送通知失败，支持的通知类型包括\"all\",\"android\",\"ios\"。");
//			}
//			
//			cn.jpush.api.push.model.notification.Notification.Builder nBuilder = Notification.newBuilder();
//			if(notification.contains("all") || notification.contains("android")) {
//				nBuilder.addPlatformNotification(AndroidNotification.newBuilder()
//						.setAlert(title)
//						.addExtras(extraParams)
//						.build());
//			}
//			if(notification.contains("all") || notification.contains("ios")) {
//				nBuilder.addPlatformNotification(
//						IosNotification.newBuilder()
//						.setAlert(title)
//						.setSound("")
//						.addExtras(extraParams)
//						.build()
//					);
//			}
//			/*if(notification.contains("all") || notification.contains("winphone")) {
//				nBuilder.addPlatformNotification(
//						WinphoneNotification.newBuilder()
//						.setAlert(notice.getTitle())
//						.addExtra("type", notice.getType())
//						.addExtra("id", notice.getId())
//						.addExtra("target", notice.getTarget())
//						.build()
//					);
//			}*/
//			
//			builder.setNotification(nBuilder.build());
//		} catch (BaseException be) {
//			throw be;
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BaseException("发送应用通知，配置Notification错误！");
//		}
//	}
//	
//	/**
//	 * 配置Message
//	 * 
//	 * @throws BaseException 
//	 */
//	private static void setMessage(
//			cn.jpush.api.push.model.PushPayload.Builder builder,
//			String message, String title, String content,
//			Map<String, String> extraParams) throws BaseException {
//		try {
//			if(StringUtils.isBlank(message)){
//				return;
//			} 
//			if (!message.contains("all") && !message.contains("message")
//					&& !message.contains("ios")
//					&& !message.contains("winphone")){
//				throw new BaseException("发送消息失败，支持的消息类型包括\"all\",\"android\",\"ios\"。");
//			}
//			
//			cn.jpush.api.push.model.Message.Builder mBuilder = Message.newBuilder();
//			if(StringUtils.isNotBlank(message)) {
//				mBuilder.setTitle(title)
//						.setMsgContent(content)
//						.addExtras(extraParams);
//			}
//			
//			builder.setMessage(mBuilder.build());
//		} catch (BaseException be) {
//			throw be;
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BaseException("发送应用通知，配置Message错误！");
//		}
//	}
//	
//	/**
//	 * 配置Options
//	 * 
//	 * @throws BaseException 
//	 */
//	private static void setOptions(
//			cn.jpush.api.push.model.PushPayload.Builder builder,
//			boolean production, Map<String, String> extraParams) throws BaseException {
//		try {
//			cn.jpush.api.push.model.Options.Builder oBuilder = Options.newBuilder();
//			oBuilder.setApnsProduction(production);
//			
//			builder.setOptions(oBuilder.build());
//		} catch (BaseException be) {
//			throw be;
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BaseException("发送应用通知，配置Options错误！");
//		}
//	}
//	
//	@Value("${app.notice.app-key:8a8c7db154ebe90c0154ebfdd1270004:c5ed55280faea519bab02279,352e469fbf83b123dbb9d4f0|40281882554de9e101554df07eed0003:7ebe25f6f01aad59270bc29c,d52d91623ec468de4724ee85}")
//	public void setJPUSH_CLIENT_MAP(String appKeysStr) {
//		String[] appKeysArr = null;
//		String[] appKey = null;
//		String[] _appKey = null;
//		if(StringUtils.isNotBlank(appKeysStr)){
//			appKeysArr = appKeysStr.split("\\|");
//			for(int i=0; i<appKeysArr.length; i++){
//				appKey = appKeysArr[i].split(":");
//				if(StringUtils.isNotBlank(appKey[0]) && StringUtils.isNotBlank(appKey[1])){
//					_appKey = appKey[1].split(",");
//					JPUSH_CLIENT_MAP.put(appKey[0], new JPushClient( _appKey[1], _appKey[0]));
//				}
//			}
//		}
//	}
//	
//}
