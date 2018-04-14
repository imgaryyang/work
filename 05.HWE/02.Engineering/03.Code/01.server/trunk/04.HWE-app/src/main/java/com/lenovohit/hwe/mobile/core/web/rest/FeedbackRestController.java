package com.lenovohit.hwe.mobile.core.web.rest;

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
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.mobile.core.model.Feedback;

@RestController
@RequestMapping("hwe/app/feedBack")
public class FeedbackRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<Feedback, String> feedbackManager;

	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		if(null == data){
			throw new BaseException("数据为空！");
		}
		Feedback model = JSONUtils.deserialize(data, Feedback.class);
		if(null == model){
			throw new BaseException("数据为空！");
		}
		
		// 校验不为空
		if (StringUtils.isEmpty(model.getFeedback())) {
			throw new BaseException("反馈意见数据为空！");
		}
		
		//Users user = (Users) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if (!model.getUserId().isEmpty()){
			model.setUserId(model.getUserId());
		}
		
		model.setFeededAt(DateUtils.getCurrentDate());
		model = this.feedbackManager.save(model);

		return ResultUtils.renderSuccessResult(model);
	}
}
