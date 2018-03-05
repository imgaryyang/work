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
import com.lenovohit.hwe.mobile.core.model.AppBodyPart;
import com.lenovohit.hwe.mobile.core.model.Disease;
import com.lenovohit.hwe.base.model.Dic;

@RestController
@RequestMapping("hwe/app/disease")
public class DiseaseRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<Disease, String> diseaseManager;
	@Autowired
	private GenericManager<AppBodyPart, String> bodyPartManager;
	
	//查找常见疾病
	@RequestMapping(value = "/listCommonDisease", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listCommonDisease(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Disease> diseases=diseaseManager.findByProp("isCommon","1");
		return ResultUtils.renderSuccessResult(diseases);
	}
	//根据关键字查找
	@RequestMapping(value = "/listByKeyWords", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listByKeyWords(@RequestParam(value = "data", defaultValue = "") String data) {
		Disease model = JSONUtils.deserialize(data, Disease.class);
		List<Object> values=new ArrayList<Object>();
		String jql="from Disease where diseaseName like ? ";
		values.add("%" + model.getDiseaseName() + "%");
		List<Disease> diseases=(List<Disease>) diseaseManager.findByJql(jql, values.toArray());
		return ResultUtils.renderSuccessResult(diseases);
	}
	//根据身体部位查找
	@RequestMapping(value = "/listPart", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listPart(@RequestParam(value = "data", defaultValue = "") String data) {
		List<AppBodyPart> bodyParts=bodyPartManager.findAll();
		return ResultUtils.renderSuccessResult(bodyParts);
	}
	//根据身体部位查找相关疾病
	@RequestMapping(value = "/listByPart", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listByPart(@RequestParam(value = "data", defaultValue = "") String data) {
		Disease model = JSONUtils.deserialize(data, Disease.class);
		List<Disease> disease=(List<Disease>) diseaseManager.findByProp("partId", model.getPartId());
		return ResultUtils.renderSuccessResult(disease);
	}
}
