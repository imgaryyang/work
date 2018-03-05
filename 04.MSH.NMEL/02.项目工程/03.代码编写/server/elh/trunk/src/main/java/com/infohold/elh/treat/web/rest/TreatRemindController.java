package com.infohold.elh.treat.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.ElConstants;
import com.infohold.el.base.model.User;
import com.infohold.elh.treat.model.DrugRemind;

@RestController
@RequestMapping("/elh/treat/drugRemind/")
public class TreatRemindController extends BaseRestController {
	
	@Autowired
	private GenericManager<DrugRemind, String> drugRemindManager;

	/**
	 * 新增
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		DrugRemind drugRemind = new DrugRemind();
		drugRemind = JSONUtils.deserialize(data, DrugRemind.class);
//		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
//		String userId = _user.getId();
		String userId = "ff808081559647e801559669ae340003";
		
		if (null == drugRemind) {
			throw new BaseException("输入数据为空！");
		}
		
		if (StringUtils.isEmpty(drugRemind.getBeginDate())) {
			throw new BaseException("起始时间为空！");
		}
		if (StringUtils.isEmpty(drugRemind.getEndDate())) {
			throw new BaseException("截止时间为空！");
		}
		if (StringUtils.isEmpty(drugRemind.getAlarmTime())) {
			throw new BaseException("提醒时间为空！");
		}
		if (StringUtils.isEmpty(drugRemind.getMedUsage())) {
			throw new BaseException("药品用法为空！");
		}
		drugRemind.setUserId(userId);
		drugRemind.setState("0");
		drugRemind.setType("0");
		drugRemind.setAlarmId("111111");
		
		int alarmCount = drugRemind.getAlarmTime().length()/9 ;
		String AlarmTimes = drugRemind.getAlarmTime();
		for( int ii = 0;ii< alarmCount;ii++ ){
			System.out.println(ii);
			
			String alarmTime = AlarmTimes.substring(9*ii,9*ii+9);
			System.out.println(alarmTime);
			drugRemind.setAlarmTime(alarmTime);
			drugRemind.setId("");
			System.out.println(drugRemind);
			DrugRemind drugRemind2 = this.drugRemindManager.save(drugRemind);
		}
		
		return ResultUtils.renderSuccessResult(drugRemind);
	}
	/**
	 * 修改
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/change", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forChange(@RequestBody String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		
		DrugRemind _drugRemind = new DrugRemind();
		_drugRemind = JSONUtils.deserialize(data, DrugRemind.class);
		
		if (null == _drugRemind) {
			throw new BaseException("输入数据为空！");
		}
		DrugRemind drugRemind = this.drugRemindManager.get(_drugRemind.getId());
		if (!StringUtils.isEmpty(_drugRemind.getBeginDate())) {
			drugRemind.setBeginDate(_drugRemind.getBeginDate());
		}
		if (!StringUtils.isEmpty(_drugRemind.getEndDate())) {
			drugRemind.setEndDate(_drugRemind.getEndDate());
		}
		if (!StringUtils.isEmpty(_drugRemind.getMedUsage())) {
			drugRemind.setMedUsage(_drugRemind.getMedUsage());
		}
		if (!StringUtils.isEmpty(_drugRemind.getAlarmTime())) {
			drugRemind.setAlarmTime(_drugRemind.getAlarmTime());
		}
		
		drugRemind = this.drugRemindManager.save(drugRemind);
		
		return ResultUtils.renderSuccessResult(drugRemind);
	}
	
	/**
	 * 删除
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable(value = "id") String id) {
		// 数据校验
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入数据为空！");
		}
		
		DrugRemind drugRemind = this.drugRemindManager.get(id);
		if(drugRemind.getState()=="1"){
			drugRemind.setState("0");
		}else{
			drugRemind.setState("1");
		}
		drugRemind = this.drugRemindManager.save(drugRemind);
		
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDrugRemindList() {

		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		String userId = _user.getId();
		List<DrugRemind> drugReminds = drugRemindManager.find(
				" from DrugRemind d where state = '0' and userId=? ", userId );
		
		
		return ResultUtils.renderSuccessResult(drugReminds);
	}
}