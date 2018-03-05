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
import com.lenovohit.hwe.mobile.core.model.Laboratory;
/**
 * 工具---化验单解读
 * @author redstar
 *
 */
@RestController
@RequestMapping("hwe/app/laboratory")
public class LaboratoryRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<Laboratory, String> laboratoryManager;
	@Autowired
	private GenericManager<Classification, String> classificationManager;
	
	//查找化验单父分类
	@RequestMapping(value = "/listFirstLevelTest", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listFirstLevelTest(@RequestParam(value = "data", defaultValue = "") String data) {
		String jql="from Classification where classType = 3 and  parentNode = '  ' ";
		List<Classification> dicts=classificationManager.find(jql);
		return ResultUtils.renderSuccessResult(dicts);
	}
	//查找化验单子分类
	@RequestMapping(value = "/listSecondLevelTest", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listCommonDisease(@RequestParam(value = "data", defaultValue = "") String data) {
		Classification model = JSONUtils.deserialize(data, Classification.class);
		List<Object> values=new ArrayList<Object>();
		values.add(model.getParentNode());
		String jql="from Classification where classType = 3 and  parentNode = ?  ";
		List<Classification> dicts=classificationManager.find(jql,values.toArray());
		return ResultUtils.renderSuccessResult(dicts);
	}
	//根据关键字搜索化验
	@RequestMapping(value = "/listByKeyWords", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listByKeyWords(@RequestParam(value = "data", defaultValue = "") String data) {
		Laboratory model = JSONUtils.deserialize(data, Laboratory.class);
		List<Object> values=new ArrayList<Object>();
		String jql="from Laboratory where laboratoryName like ? ";
		values.add("%" + model.getLaboratoryName() + "%");
		List<Laboratory> laboratory=(List<Laboratory>) laboratoryManager.findByJql(jql, values.toArray());
		return ResultUtils.renderSuccessResult(laboratory);
	}
	//根据化验单类型搜索化验单明细
	@RequestMapping(value = "/listLaboratoryByType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listEmergencyByType(@RequestParam(value = "data", defaultValue = "") String data) {
		Classification model = JSONUtils.deserialize(data, Classification.class);
		String jql="from  Laboratory where classificationId = ? ";
		List<Object> values=new ArrayList<Object>();
		values.add(model.getParentNode().trim());
		//c=emergencyManager.findByProp("classificationId", model.getClassificationId());
		List<Laboratory> laboratory=(List<Laboratory>) laboratoryManager.findByJql(jql, values.toArray());
		return ResultUtils.renderSuccessResult(laboratory);
	}
	
}
