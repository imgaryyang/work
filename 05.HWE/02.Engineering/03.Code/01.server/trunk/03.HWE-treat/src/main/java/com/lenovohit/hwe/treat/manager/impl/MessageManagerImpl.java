package com.lenovohit.hwe.treat.manager.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.base.model.Notice;
import com.lenovohit.hwe.base.utils.jpush.JpushClientUtil;
import com.lenovohit.hwe.base.utils.notice.NoticeUtils;
import com.lenovohit.hwe.treat.manager.MessageManager;
import com.lenovohit.hwe.treat.model.ConsultRecord;
import com.lenovohit.hwe.treat.model.ConsultReply;

@Service
public class MessageManagerImpl implements MessageManager{
	
	@Autowired
	private GenericManager<ConsultReply, String> consultReplyManager;
	
	@Autowired
	private GenericManager<Notice, String> noticeManager;
	
	@Autowired
	private GenericManager<ConsultRecord, String> consultRecordManager;
	
	

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
		String apps = notice.getAppId();
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
		if(StringUtils.isBlank(mobiles)){
			throw new BaseException("发送短信错误！未指定手机号。");
		}
		
		//调用短信接口
		//MessageUtils.sendMessage(mobiles, type, extraParams);
	}
	
	private static String  objectToString(Object obj){
		if(obj==null) return "";
		return obj.toString();
	}

	@Override
	public boolean sendReply(String data) {
	    try{
	    	// 保存回复信息
			ConsultReply reply = JSONUtils.deserialize(data, ConsultReply.class);
			this.consultReplyManager.save(reply);
			
			// 保存系统消息
			Notice notice = new Notice();
			notice.setTitle("您的咨询有回复了");
			notice.setContent("尊敬的用户,您的咨询有回复了，请查收。谢谢关注MSH客户端");
			notice.setTarget("ConsultRecords");
			notice.setType(Notice.NOT_TYPE_APP_REPLY);
			notice.setMode(Notice.NOT_MODE_APP);
			notice.setReceiverType("1");
			notice.setReceiverValue(reply.getSendId());
			notice.setStatus(Notice.NOT_STATUE_SENT);
			this.noticeManager.save(notice);

			// 调用推送接口
	        JpushClientUtil.sendToAll(notice.getTitle(), "尊敬的用户", "医生回复了您的咨询，请查收。谢谢关注MSH客户端", data);
	        
	        // 修改咨询状态
	        ConsultRecord record = this.consultRecordManager.get(reply.getBusinessId());
	        record.setStatus(ConsultRecord.STATUS_REPLY);
	        this.consultRecordManager.save(record);
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
			
		
		return true;
		
	}
}
