package com.lenovohit.ssm.treat.web.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;

/**
 * 消息
 */
@RestController
@RequestMapping("/ssm/treat/sms")
public class MessageRestController extends BaseRestController {
	/**
	 * 获取验证码
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/verifyCode/{phoneNo}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAuthCode(){
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 校验验证码
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/verify",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCheckAuthCode(){
		return ResultUtils.renderSuccessResult();
	}
}
