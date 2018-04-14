package com.lenovohit.hwe.base.web.rest;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.configuration.SmsConfig;
import com.lenovohit.hwe.base.model.SmsMessage;
import com.lenovohit.hwe.base.utils.MD5Utils;
import com.lenovohit.hwe.base.utils.SmsMessageUtils;

/**
 * 短信验证码管理
 */
@RestController
@RequestMapping("/hwe/base/sms")
@EnableConfigurationProperties(SmsConfig.class)
public class SmsMessageRestController extends BaseRestController {

	@Autowired
	private GenericManager<SmsMessage, String> smsMessageManager;
	@Autowired
	private SmsConfig smsConfig;
	
	private SmsMessageUtils smsUtils = SmsMessageUtils.getInstance();

	
	@RequestMapping(value="/securityCode",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSendCode(@RequestBody String data){
		SmsMessage smsMessage =  JSONUtils.deserialize(data, SmsMessage.class);
		validSmsMessage(smsMessage);
		buildSmsMessage(smsMessage);
		System.out.println("Uid："+smsConfig.getUid());
//		int result = smsUtils.sendMsgGbk(smsConfig.getUid(), smsConfig.getKey(), smsMessage.getContent(), smsMessage.getMobile());
//		if(result > 0){
//			this.smsMessageManager.save(smsMessage);
//			return ResultUtils.renderSuccessResult(smsMessage);
//		} else {
//			return ResultUtils.renderFailureResult();
//		}
		this.smsMessageManager.save(smsMessage);
		SmsMessage _sMessage = new SmsMessage();
//		_sMessage.setToken(smsMessage.getToken());
		_sMessage.setMobile(smsMessage.getMobile());
		_sMessage.setType(smsMessage.getType());
//		_sMessage.setId(smsMessage.getId());
//		_sMessage.setCode(smsMessage.getCode());
		return ResultUtils.renderSuccessResult(_sMessage);
	}
	
	/**
	 * 验证码校验（需修改成mobile,code,type验证）
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/verifySecurityCode",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forValidCode(@RequestBody String data){
		SmsMessage smsMessage =  JSONUtils.deserialize(data, SmsMessage.class);
		
		if(null == smsMessage || StringUtils.isEmpty(smsMessage.getMobile())
				|| StringUtils.isEmpty(smsMessage.getCode()) || StringUtils.isEmpty(smsMessage.getType())){
			return ResultUtils.renderFailureResult("参数错误!");
		}
		String code = smsMessage.getCode();
		Date currentDate = DateUtils.getCurrentDate();
		int num = 0;
		List<SmsMessage> msgs = this.smsMessageManager.find("from SmsMessage where mobile = ? and code = ? and type = ? ", 
				smsMessage.getMobile(), code, smsMessage.getType());
		if(msgs.isEmpty()){
			return ResultUtils.renderFailureResult("未找到对应记录!");
		}
		for(SmsMessage sMessage : msgs){
			long outTime = (currentDate.getTime()-sMessage.getSendtime().getTime())/1000;
			if(StringUtils.equals(code, sMessage.getCode()) && outTime < 120){
				num += 1;
			}
		}
		if(num <= 0){
			return ResultUtils.renderFailureResult("验证码已过期！");
		}
		SmsMessage message = new SmsMessage();
		message.setToken(msgs.get(0).getId());
		return ResultUtils.renderSuccessResult(message);
	}
	/**
	 * 验证码校验（需修改成mobile,code,type验证）
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/vaildCode",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result validCode(@RequestBody String data){
		SmsMessage smsMessage =  JSONUtils.deserialize(data, SmsMessage.class);	
		if(null == smsMessage || StringUtils.isEmpty(smsMessage.getMobile())
				|| StringUtils.isEmpty(smsMessage.getCode()) || StringUtils.isEmpty(smsMessage.getType())){
			return ResultUtils.renderFailureResult("参数错误!");
		}
		int num = 0;
		String mobile = smsMessage.getMobile();
		String code = smsMessage.getCode();
		String type = smsMessage.getType();
		Date currentDate = DateUtils.getCurrentDate();
		Date date = DateUtils.addSecond(currentDate, -120);
		List<SmsMessage> messages = this.smsMessageManager.find("from SmsMessage where mobile = ? and code = ? and type = ? and sendTime > ? ", 
				mobile, code, type, date);
		if(messages.isEmpty()){
			return ResultUtils.renderFailureResult("未找到对应记录!");
		}
		for(SmsMessage msg : messages){
			if(code.equals(msg.getCode())){
				num += 1;
			}
		}
		if(num > 0){
			return ResultUtils.renderSuccessResult("验证成功");
		}
		return ResultUtils.renderFailureResult("验证码错误，请核对验证码！");
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
	private void buildSmsMessage(SmsMessage message) {
		if (null == message) {
        	throw new NullPointerException("message should not be NULL!");
        }
		String token = "";
//		message.setCode(SmsMessageUtils.createCode(true, 4));
		message.setCode("666666");
		message.setSendtime(DateUtils.getCurrentDate());
		try {
			token = MD5Utils.encoderByMd5(message.getCode()+"@"+message.getSendtime());
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		message.setToken(token);
		message.setOutTime("120");
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
		} else if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_REG_APP, message.getType())){
			message.setContent("验证码"+message.getCode()+"，请勿向任何人提供您的短信验证码。用于您本次通过手机APP登录联想智慧医院");
		}else if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_REG_WX, message.getType())){
			message.setContent("验证码"+message.getCode()+"，请勿向任何人提供您的短信验证码。用于您本次通过微信公众号登录联想智慧医院");
		}else if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_REG_ALIPAY, message.getType())){
			message.setContent("验证码"+message.getCode()+"，请勿向任何人提供您的短信验证码。用于您本次通过支付宝服务窗登录联想智慧医院");
		}else if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_REG_WEB, message.getType())){
			message.setContent("验证码"+message.getCode()+"，请勿向任何人提供您的短信验证码。用于您本次通过网页登录联想智慧医院");
		}else if(StringUtils.equals(SmsMessage.MESSAGE_TYPE_BIND_PRO, message.getType())){
			message.setContent("验证码"+message.getCode()+"，请勿向任何人提供您的短信验证码。用于您本次绑定卡号");
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
