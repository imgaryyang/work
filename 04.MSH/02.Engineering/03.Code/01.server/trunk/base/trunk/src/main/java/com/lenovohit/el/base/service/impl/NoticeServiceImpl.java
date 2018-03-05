package com.lenovohit.el.base.service.impl;

import java.util.Map;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.el.base.model.Notice;
import com.lenovohit.el.base.service.NoticeService;
import com.lenovohit.el.base.utils.message.MessageUtils;
import com.lenovohit.el.base.utils.notice.NoticeUtils;

public class NoticeServiceImpl implements NoticeService {

	@Override
	public boolean send(Notice notice){
		try {
			if(null == notice){
				throw new BaseException("发送消息失败，notice实例为空！");
			}
			if(StringUtils.isBlank(notice.getMode())){
				notice.setMode("1");		//方式，默认为应用提醒
			}
			if(StringUtils.isBlank(notice.getType())){
				notice.setType("00");	 	//业务类型，默认为系统公告
			}
			switch (notice.getMode()) {
				case "0":
					sendNotice(notice);
					sendMessage(notice);
					break;
				case "1":
					sendNotice(notice);
				case "2":
					break;
				case "3":
					sendMessage(notice);
					break;
				case "4":
					break;
				case "5":
					break;
				case "6":
					break;
				case "9":
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
			
		
		return true;
	}
	
	private void sendNotice(Notice notice) throws BaseException{
		Map<String, String> extraParams = notice.getExtraParams();
		String apps = notice.getApps();
		String receiverType = notice.getReceiverType();
		String receiverValue = notice.getReceiverValue();
		String platform = objectToString(extraParams.get("platform"));
		String notification = objectToString(extraParams.get("notification"));
		String message = objectToString(extraParams.get("message"));
		String production = objectToString(extraParams.get("production"));
		
		
		if(StringUtils.isBlank(apps)){
			throw new BaseException("发送应用通知错误！未指定APP。");
		}
		if(StringUtils.isBlank(platform)){
			platform = "all";
		}
		if(StringUtils.isBlank(notification)){
			notification = "all";
		}
		if(StringUtils.isBlank(production)){
			production = "true";
		}
		if(StringUtils.isBlank(receiverType) 
				|| (!receiverType.equals("0") && !receiverType.equals("1") && !receiverType.equals("2") && !receiverType.equals("3"))){
			receiverType = "0";
		}
		extraParams.put("id", notice.getId());
		extraParams.put("type", notice.getType());
		extraParams.put("target", notice.getTarget());
		
		NoticeUtils.sendNotice(apps, platform, receiverType, receiverValue,
				notification, message, notice.getTitle(), notice.getContent(),
				StringUtils.equals("true", production), extraParams);
	}
	
	private void sendMessage(Notice notice){
		Map<String, String> extraParams = notice.getExtraParams();
		String mobiles = extraParams.get("mobiles");
		String type = notice.getType();
		if(StringUtils.isBlank(mobiles)){
			throw new BaseException("发送短信错误！未指定手机号。");
		}
		
		MessageUtils.sendMessage(mobiles, type, extraParams);
	}
	
	private static String  objectToString(Object obj){
		if(obj==null) return "";
		return obj.toString();
	}
}
