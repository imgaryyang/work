package com.lenovohit.hcp.odws.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.odws.model.Diagnose;

/**
 * 诊断
 */
@RestController
@RequestMapping("/hcp/odws/diagnose")
public class DiagnoseController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Diagnose, String> diagnoseManager;

	/**
	 * 根据挂号id取对应的所有诊断
	 * 
	 * @param regId
	 * @return
	 */
	@RequestMapping(value = "/list/{regId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDiagnosisPage(@PathVariable("regId") String regId) {
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from Diagnose where regId = ? order by sortNo ");
		values.add(regId);
		List<Diagnose> list = (List<Diagnose>) diagnoseManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(list);
	}

	/**
	 * 保存诊断信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {

		HcpUser user = this.getCurrentUser();
		JSONObject json = JSONObject.parseObject(data);
		Diagnose model = new Diagnose();

		model.setRegId(json.getString("regId"));
		model.setDiseaseType("1"); // 类型：门诊诊断
		model.setDiseaseId(json.getString("diagnosisCode"));
		model.setDiseaseName(json.getString("diagnosisName"));
		model.setDiseaseTime(new Date());

		Department dept = new Department();
		dept.setId(user.getLoginDepartment().getId());
		model.setDiseaseDept(dept);

		HcpUser doctor = new HcpUser();
		doctor.setId(user.getId());
		model.setDiseaseDoc(doctor);

		model.setIscurrent(json.getString("iscurrent"));
		model.setStopFlag("1");
		model.setSortNo(json.getInteger("sortNo"));

		Diagnose saved = diagnoseManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	/**
	 * 设置主诊断
	 * 
	 * @param regId
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/setMainDiagnose/{regId}/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forSetMainDiagnose(@PathVariable("regId") String regId, @PathVariable("id") String id) {
		//根据挂号id查询对应的所有诊断
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from Diagnose where regId = ? order by sortNo ");
		values.add(regId);
		List<Diagnose> list = (List<Diagnose>) diagnoseManager.find(jql.toString(), values.toArray());
		//变更主诊断标识及序号
		int i = 2;
		for(Diagnose diagnose : list) {
			if (diagnose.getId().equals(id)) {
				diagnose.setIscurrent("1");
				diagnose.setSortNo(1);
			} else {
				diagnose.setIscurrent("0");
				diagnose.setSortNo(i);
				i += 1;
			}
			diagnoseManager.save(diagnose);
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 删除诊断
	 * 
	 * @param regId
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/delete/{regId}/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("regId") String regId, @PathVariable("id") String id) {
		//根据挂号id查询对应的所有诊断
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from Diagnose where regId = ? order by sortNo ");
		values.add(regId);
		List<Diagnose> list = (List<Diagnose>) diagnoseManager.find(jql.toString(), values.toArray());
		//删除诊断，并变更其他诊断的主诊断标识及序号
		int i = 1;
		for(Diagnose diagnose : list) {
			if (diagnose.getId().equals(id)) {
				diagnoseManager.delete(diagnose);
			} else {
				if (i == 1) diagnose.setIscurrent("1");
				else diagnose.setIscurrent("0");
				diagnose.setSortNo(i);
				i += 1;
				diagnoseManager.save(diagnose);
			}
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 取当前登录医生常用的20条诊断
	 * @return
	 */
	@RequestMapping(value = "/list/top", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTopDiagnosis() {
		//当前登录用户
		HcpUser user = this.getCurrentUser();
		
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("select d.diseaseId, d.diseaseName, ");
		jql.append("bd.phoneticCode, bd.wangCode, count(*) as sumCount ");
		jql.append("from Diagnose d, Diagnosis bd where d.diseaseDoc.id = ? and d.diseaseId = bd.diagnosisCode ");
		jql.append("group by d.diseaseId, d.diseaseName, bd.phoneticCode, bd.wangCode order by sumCount desc");
		values.add(user.getId());
		List<Object> list = (List<Object>) diagnoseManager.findPageList(0, 20, jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(list);
	}
}
