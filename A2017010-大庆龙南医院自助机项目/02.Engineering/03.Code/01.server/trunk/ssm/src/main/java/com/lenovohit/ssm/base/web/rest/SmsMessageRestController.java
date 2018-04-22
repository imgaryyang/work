package com.lenovohit.ssm.base.web.rest;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.SmsMessage;
import com.lenovohit.ssm.base.utils.SmsMessageUtils;

/**
 * 短信验证码管理
 */
@RestController
@RequestMapping("/ssm/base/sms")
public class SmsMessageRestController extends BaseRestController {

	@Autowired
	private GenericManager<SmsMessage, String> smsMessageManager;

	
	@RequestMapping(value="/sendCode",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSendCode(@RequestBody String data){
		SmsMessage smsMessage =  JSONUtils.deserialize(data, SmsMessage.class);
		
		validSmsMessage(smsMessage);
		buildSmsMessage(smsMessage);
		
		//boolean sendFlag = true;//TODO
		boolean sendFlag = SmsMessageUtils.sendMsg(smsMessage.getMobile(), smsMessage.getContent(), null);
		if(sendFlag){
			this.smsMessageManager.save(smsMessage);
			return ResultUtils.renderSuccessResult(smsMessage);
		} else {
			return ResultUtils.renderFailureResult();
		}
	}
	
	@RequestMapping(value="/validCode",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forValidCode(@RequestBody String data){
		SmsMessage smsMessage =  JSONUtils.deserialize(data, SmsMessage.class);
		
		if(null == smsMessage || StringUtils.isEmpty(smsMessage.getId())
				|| StringUtils.isEmpty(smsMessage.getCode())){
			return ResultUtils.renderFailureResult("参数错误!");
		}
		
		SmsMessage _smsMessage = this.smsMessageManager.get(smsMessage.getId());
		if(null == _smsMessage ){
			return ResultUtils.renderFailureResult("未找到对应记录!");
		}
		if(StringUtils.equals(_smsMessage.getCode(), smsMessage.getCode())){
			return ResultUtils.renderSuccessResult();
		} else {
			return ResultUtils.renderFailureResult("验证码错误，请核对验证码！");
		}
	}
	
	private void validSmsMessage(SmsMessage message){
		if (null == message) {
        	throw new NullPointerException("message should not be NULL!");
        }
        if (StringUtils.isEmpty(message.getMobile())) {
            throw new NullPointerException("mobile should not be NULL!");
        }
        if (StringUtils.isEmpty(message.getType())) {
            throw new NullPointerException("type should not be NULL!");
        }
        //TODO 暂未做ip和次数校验
        
//        if (!StringUtils.equals(SmsMessage.MESSAGE_TYPE_REG, message.getType()) &&
//        		!StringUtils.equals(SmsMessage.MESSAGE_TYPE_PWD, message.getType()) &&
//        		!StringUtils.equals(SmsMessage.MESSAGE_TYPE_RFO, message.getType())) {
//            throw new NullPointerException(message.getType() +"  is not supported!");
//        }
	}
	private void buildSmsMessage(SmsMessage message){
		if (null == message) {
        	throw new NullPointerException("message should not be NULL!");
        }
		message.setCode(SmsMessageUtils.createCode(true, 4));
		message.setSendtime(DateUtils.getCurrentDate());
		message.setStatus("0");
		message.setValidNum(0);
		message.setIp(getLocalIp(this.getRequest()));
		if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_REG, message.getType())){
			message.setContent("验证码"+message.getCode()+"。尊敬的用户，您正在使用本院自助机进行建档，请勿向任何人提供您的短信验证码。");
		} else if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_REP, message.getType())){
			message.setContent("验证码"+message.getCode()+"。尊敬的用户，您正在使用本院自助机进行补卡，请勿向任何人提供您的短信验证码。");
		} else if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_PAY, message.getType())){
			message.setContent("验证码"+message.getCode()+"。尊敬的用户，您正在使用本院自助机进行缴费，请勿向任何人提供您的短信验证码。");
		} else if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_DEP, message.getType())){
			message.setContent("验证码"+message.getCode()+"。尊敬的用户，您正在使用本院自助机进行预存，请勿向任何人提供您的短信验证码。");
		} else if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_RFO, message.getType())){
			message.setContent("验证码"+message.getCode()+"。尊敬的用户，您正在使用本院自助机进行退款，请勿向任何人提供您的短信验证码。");
		}else{
			message.setContent("验证码"+message.getCode()+"。尊敬的用户，您正在使用本院自助机进行操作，请勿向任何人提供您的短信验证码。");
		}
	}
	
	/**
	 * 获取客户端Ip
	 * @param request
	 * @return
	 */
	private String getLocalIp(HttpServletRequest request){
		String ip = request.getHeader("X-Forwarded-For");
        if(StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)){
            //多次反向代理后会有多个ip值，第一个ip才是真实ip
            int index = ip.indexOf(",");
            if(index != -1){
                return ip.substring(0,index);
            }else{
                return ip;
            }
        }
        ip = request.getHeader("X-Real-IP");
        if(StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)){
            return ip;
        }
        return request.getRemoteAddr();
	}
}
