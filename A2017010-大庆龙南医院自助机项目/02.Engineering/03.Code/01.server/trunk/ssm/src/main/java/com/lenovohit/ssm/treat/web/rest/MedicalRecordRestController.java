package com.lenovohit.ssm.treat.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.treat.manager.HisOutpatientManager;
import com.lenovohit.ssm.treat.model.MedicalRecord;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

/**
 * 就诊记录、病历
 */
@RestController
@RequestMapping("/ssm/treat/medicalRecord")
public class MedicalRecordRestController extends SSMBaseRestController {
	
	@Autowired
	private HisOutpatientManager hisOutpatientManager;

	/**
	 * 就诊记录列表（分页）
	 * @param data
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
				@RequestParam(value = "data", defaultValue = "") String data){
		MedicalRecord medicalRecord = JSONUtils.deserialize(data, MedicalRecord.class);
		HisListResponse<MedicalRecord> response = hisOutpatientManager.getMedicalRecords(medicalRecord);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 就诊记录列表（分页）
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data){
		MedicalRecord medicalRecord = JSONUtils.deserialize(data, MedicalRecord.class);
		HisListResponse<MedicalRecord> response = hisOutpatientManager.getMedicalRecords(medicalRecord);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 就诊记录详细信息（门诊病历详细信息）
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/info", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@RequestParam(value = "data", defaultValue = "") String data){
		MedicalRecord medicalRecord = JSONUtils.deserialize(data, MedicalRecord.class);
		HisResponse response = hisOutpatientManager.getMedicalRecord(medicalRecord);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 病历打印回传
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/print/{recordId}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forPrinted(@PathVariable("recordId") String recordId){
		MedicalRecord medicalRecord = new MedicalRecord();
		medicalRecord.setRecordId(recordId);
		medicalRecord.setHisUserid(this.getCurrentMachine().getHisUser());
		HisResponse response = hisOutpatientManager.medicalRecordPrint(medicalRecord);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	
}
