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
import com.lenovohit.hwe.mobile.core.model.Vaccine;
/**
 * 工具-预防接种
 * @author redstar
 *
 */

@RestController
@RequestMapping("hwe/app/vaccine")
public class VaccineRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<Vaccine, String> vaccineManager;
	
	
	//根据关键字搜索疫苗
	@RequestMapping(value = "/listByKeyWords", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listByKeyWords(@RequestParam(value = "data", defaultValue = "") String data) {
		Vaccine model = JSONUtils.deserialize(data, Vaccine.class);
		List<Object> values=new ArrayList<Object>();
		String jql="from Vaccine where vaccineName like ? ";
		values.add("%" + model.getVaccineName() + "%");
		List<Vaccine> vaccine=(List<Vaccine>) vaccineManager.findByJql(jql, values.toArray());
		return ResultUtils.renderSuccessResult(vaccine);
	}
	
	@RequestMapping(value = "/listAll", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listAll() {
		List<Vaccine> vaccine=(List<Vaccine>) vaccineManager.findAll();
		return ResultUtils.renderSuccessResult(vaccine);
	}
	//新生儿接种疫苗查询
	@RequestMapping(value = "/listRecent", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listcurrent() {
		String jql="from Vaccine where vaccineName = '乙肝疫苗' or vaccineName = '卡介苗' ";
		List<Vaccine> vaccine=(List<Vaccine>) vaccineManager.find(jql);
		return ResultUtils.renderSuccessResult(vaccine);
	}
	
}
