package com.lenovohit.hwe.base.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.model.Habits;
import com.lenovohit.hwe.org.model.User;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;

@RestController
@RequestMapping("/hwe/base/habits")
public class HabitsRestController extends OrgBaseRestController {
	@Autowired
	private GenericManager<Habits, String> habitsManager;
	
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		User user = this.getCurrentUser();
		if(null == user){
			throw new BaseException("请重新登录");
		}
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		Habits model = JSONUtils.deserialize(data, Habits.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		model.setUserId(user.getId());
		model = this.habitsManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "/update", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestParam(value = "data", defaultValue = "") String data) {
		log.info("修改详情，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
	
		Habits model = JSONUtils.deserialize(data, Habits.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入ID不可为空！");
		}
	
		Habits habits = this.habitsManager.get(id);
		if (null == habits) {
			throw new BaseException("更新记录不存在！");
		}
		if(StringUtils.isNotEmpty(model.getName())){
			habits.setName(model.getName());
		}
		if(StringUtils.isNotEmpty(model.getHabitType())){
			habits.setHabitType(model.getHabitType());
		}
		if(StringUtils.isNotEmpty(model.getHabitContent())){
			habits.setHabitContent(model.getHabitContent());
		}
		this.habitsManager.save(habits);
		return ResultUtils.renderSuccessResult(habits);
	}
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data){
		User user = this.getCurrentUser();
		if(null == user){
			throw new BaseException("请重新登录");
		}
		List<Habits> habits = this.habitsManager.find("from Habits where userId = ? ", user.getId());
		return ResultUtils.renderSuccessResult(habits);
	}
}
