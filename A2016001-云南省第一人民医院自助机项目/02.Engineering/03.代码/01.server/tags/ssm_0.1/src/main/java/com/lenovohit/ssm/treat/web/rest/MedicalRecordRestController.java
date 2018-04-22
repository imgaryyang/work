package com.lenovohit.ssm.treat.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.SystemPropertyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.SSMConstants;
import com.lenovohit.ssm.payment.model.Fee;
import com.lenovohit.ssm.treat.manager.HisOutpatientManager;
import com.lenovohit.ssm.treat.model.MedicalRecord;
import com.lenovohit.ssm.treat.model.Patient;

/**
 * 就诊记录、病历
 */
@RestController
@RequestMapping("/ssm/treat/medicalRecord")
public class MedicalRecordRestController extends BaseRestController {
	
	@Autowired
	private HisOutpatientManager hisOutpatientManager;

	/**
	 * 就诊记录列表（分页）
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		//获取当前患者
		Patient patient = this.getCurrentPatient();
		List<MedicalRecord> medicalRecord = hisOutpatientManager.getMedicalRecordPage(patient);
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		//page.setQuery("from MedicalRecord where 1=1 order by sort");
		page.setTotal(medicalRecord==null?0:medicalRecord.size());
		page.setResult(medicalRecord);
		
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * 就诊记录详细信息（门诊病历详细信息）
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		List<MedicalRecord> medicalDetail = hisOutpatientManager.getMedicalRecord(id);
		return ResultUtils.renderSuccessResult(medicalDetail);
	}
	/**
	 * 病历打印回传
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forPrinted(@PathVariable("id") String id){
		return ResultUtils.renderSuccessResult();
	}
	
	private Patient getCurrentPatient(){
		// 获取当前患者
		Patient patient = (Patient)this.getSession().getAttribute(SSMConstants.SSM_PATIENT_KEY);
		if(patient == null ){//TODO 生产时修改
			//patient = hisPatientManager.getPatientByHisID("");
			//TODO 异常，找不到当前患者 未登录
		}
		return patient;
	}
	
}
