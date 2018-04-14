package com.lenovohit.hwe.mobile.core.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.mobile.core.model.Classification;
import com.lenovohit.hwe.mobile.core.model.Emergency;

@RestController
@RequestMapping("hwe/app/emergency")
public class EmergencyRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<Emergency, String> emergencyManager;
	@Autowired
	private GenericManager<Classification, String> classificationManager;
	
	//查找急救类型
	@RequestMapping(value = "/listEmergencyType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listCommonDisease(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Classification> dicts=classificationManager.findByProp("classType", 4);
		return ResultUtils.renderSuccessResult(dicts);
	}
	
	//根据关键字搜索急救方法
	@RequestMapping(value = "/listByKeyWords", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listByKeyWords(@RequestParam(value = "data", defaultValue = "") String data) {
		Emergency model = JSONUtils.deserialize(data, Emergency.class);
		List<Object> values=new ArrayList<Object>();
		String jql="from Emergency where fakName like ? ";
		values.add("%" + model.getFakName() + "%");
		List<Emergency> firstAid=(List<Emergency>) emergencyManager.findByJql(jql, values.toArray());
		return ResultUtils.renderSuccessResult(firstAid);
	}
	//根据急救类型搜索急救方法
	@RequestMapping(value = "/listEmergencyByType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listEmergencyByType(@RequestParam(value = "data", defaultValue = "") String data) {
		Classification model = JSONUtils.deserialize(data, Classification.class);
		String jql="from  Emergency where classificationId = ? ";
		List<Object> values=new ArrayList<Object>();
		values.add(model.getClassificationId().trim());
		//c=emergencyManager.findByProp("classificationId", model.getClassificationId());
		List<Emergency> emergencys=(List<Emergency>) emergencyManager.findByJql(jql, values.toArray());
		return ResultUtils.renderSuccessResult(emergencys);
	}
	
}
