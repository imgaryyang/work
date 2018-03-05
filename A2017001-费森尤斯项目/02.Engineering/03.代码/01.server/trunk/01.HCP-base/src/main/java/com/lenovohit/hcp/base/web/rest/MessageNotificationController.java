package com.lenovohit.hcp.base.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.MessageNotificationManager;
import com.lenovohit.hcp.base.model.HcpUser;

/**
 * 消息提醒模块
 */
@RestController
@RequestMapping("/hcp/base/messageNotification")
public class MessageNotificationController extends HcpBaseRestController {

	@Autowired
	private MessageNotificationManager messageNotificationManagerImpl;

	/**
	 * 返回对应的未审批的采购单
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		String modelName = jsonObj.getString("modelName");
		HcpUser user = this.getCurrentUser(); 
		List<Object> models = null;
		if(modelName!=null){
			models  = (List<Object>) messageNotificationManagerImpl.find(modelName,user);
		}
		return ResultUtils.renderSuccessResult(models);
	}

}
