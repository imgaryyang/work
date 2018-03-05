package com.lenovohit.hcp.odws.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.odws.model.InquiryRecord;

/**
 * 问诊
 */
@RestController
@RequestMapping("/hcp/odws/inquiry")
public class InquiryRecordController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<InquiryRecord, String> inquiryRecordManager;
	
	/**
	 * 根据挂号id取问诊记录
	 * @param regId
	 * @return
	 */
	@RequestMapping(value = "/reg/{regId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDiagnosisPage(@PathVariable("regId") String regId) {
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from InquiryRecord where regId = ? ");
		values.add(regId);
		List<InquiryRecord> list = (List<InquiryRecord>) inquiryRecordManager.find(jql.toString(), values.toArray());
		if (list.size() > 0)
			return ResultUtils.renderSuccessResult(list.get(0));
		else
			return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 保存问诊记录
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@RequestBody String data) {

		HcpUser user = this.getCurrentUser();
		JSONObject json = JSONObject.parseObject(data);
		InquiryRecord model = JSONUtils.deserialize(data, InquiryRecord.class);

		/*model.setRegId(json.getString("regId"));
		model.setChiefComplaint(json.getString("chiefComplaint"));
		model.setPresentIllness(json.getString("presentIllness"));
		model.setPastHistory(json.getString("pastHistory"));
		model.setPhysicalExam(json.getString("physicalExam"));
		model.setOtherExam(json.getString("otherExam"));
		model.setWeight(json.getString("weight"));
		model.setHight(json.getString("hight"));
		model.setMoOrder(json.getString("moOrder"));*/
		
		model.setStopFlag("1");

		if (StringUtils.isEmpty(model.getId())) {
			Department dept = new Department();
			dept.setId(user.getLoginDepartment().getId());
			model.setSeeDept(dept);
	
			HcpUser doctor = new HcpUser();
			doctor.setId(user.getId());
			model.setSeeDoc(doctor);
			
			model.setSeeTime(new Date());
		}
		InquiryRecord saved = inquiryRecordManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

}
