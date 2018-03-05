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
import com.lenovohit.hwe.mobile.core.model.DrugInfo;
import com.lenovohit.hwe.base.model.Dic;

@RestController
@RequestMapping("hwe/app/drug")
public class DrugRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<DrugInfo, String> drugManager;
	@Autowired
	private GenericManager<Classification, String> classificationManager;
	
	//常见药品分类
	@RequestMapping(value = "/listCommonDrugType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listCommonDisease(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Classification> dicts=classificationManager.findByProp("classType", 2);
		return ResultUtils.renderSuccessResult(dicts);
	}
	
	//根据药品分类搜索小分类
	@RequestMapping(value = "/listByDrugType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listByDrugType(@RequestParam(value = "data", defaultValue = "") String data) {
		Classification model = JSONUtils.deserialize(data, Classification.class);
		StringBuilder jql=new StringBuilder("from Classification where classType = 1 ");
		List<Object> values=new ArrayList<Object>();
		List<Classification> dicts=null;
		if(model!=null){
			if( model.getParentNode()==null ){
				jql.append("and parentNode = '  ' ");
				dicts=classificationManager.find(jql.toString());
			}
			else{
				jql.append("and parentNode = ? ");
				values.add(model.getParentNode());
				dicts=classificationManager.find(jql.toString(),values.toArray());
				
			}
			return ResultUtils.renderSuccessResult(dicts);
				
		}
		return ResultUtils.renderFailureResult();
	}
	//根据关键字搜索
	@RequestMapping(value = "/listByKeyWords", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listByKeyWords(@RequestParam(value = "data", defaultValue = "") String data) {
		DrugInfo model = JSONUtils.deserialize(data, DrugInfo.class);
		List<Object> values=new ArrayList<Object>();
		String jql="from DrugInfo where drugName like ? ";
		values.add("%" + model.getDrugName() + "%");
		List<DrugInfo> drugs=(List<DrugInfo>) drugManager.findByJql(jql, values.toArray());
		return ResultUtils.renderSuccessResult(drugs);
	}
	//根据药品分类搜索对应药品
	@RequestMapping(value = "/listDrugByType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listDrugByType(@RequestParam(value = "data", defaultValue = "") String data) {
		String model = JSONUtils.deserialize(data, String.class);
		List<Object> values=new ArrayList<Object>();
		String jql="from DrugInfo where classificationId = ? ";
		values.add(model.trim());
		List<DrugInfo> drugs=(List<DrugInfo>) drugManager.findByJql(jql, values.toArray());
		return ResultUtils.renderSuccessResult(drugs);
	}
	//根据是否是抢救药物搜索
	@RequestMapping(value = "/listRescueDrug", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listRescueDrug() {
		List<DrugInfo> drugs=(List<DrugInfo>) drugManager.findByProp("isRescue", 1);
		return ResultUtils.renderSuccessResult(drugs);
	}
}
