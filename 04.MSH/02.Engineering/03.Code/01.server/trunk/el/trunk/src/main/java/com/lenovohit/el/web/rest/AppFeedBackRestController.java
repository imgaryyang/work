package com.lenovohit.el.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.lenovohit.el.ElConstants;
import com.lenovohit.el.base.model.AppFeedBack;
import com.lenovohit.el.base.model.User;

/**
 * 反馈意见
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/el/appFeedBack")
public class AppFeedBackRestController extends BaseRestController {
	@Autowired
	private GenericManager<AppFeedBack, String> appFeedBackManager;

	/**
	 * 
	 * ELB_USER_013 录入反馈意见
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		System.out.println(data);
		if(null == data){
			throw new BaseException("数据为空！");
		}
		AppFeedBack model = JSONUtils.deserialize(data, AppFeedBack.class);
		if(null == model){
			throw new BaseException("数据为空！");
		}
		
		// 校验不为空
		if (StringUtils.isEmpty(model.getFeedback())) {
			throw new BaseException("反馈意见数据为空！");
		}
		
		User user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		model.setUserId(user.getId());
		model.setFeededAt(DateUtils.getCurrentDateTimeStr());
		model = this.appFeedBackManager.save(model);

		return ResultUtils.renderSuccessResult(model);
	}
}
