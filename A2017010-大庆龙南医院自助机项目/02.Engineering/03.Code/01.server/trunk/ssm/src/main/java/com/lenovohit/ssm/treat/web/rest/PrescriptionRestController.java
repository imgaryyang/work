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
import com.lenovohit.ssm.treat.manager.HisPrescriptionManager;
import com.lenovohit.ssm.treat.model.PrescriptionItem;
import com.lenovohit.ssm.treat.model.PrescriptionRecord;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

/**
 * 处方单记录
 * @author fanyang
 *
 */
@RestController
@RequestMapping("/ssm/treat/prescriptionRecord")
public class PrescriptionRestController extends SSMBaseRestController {
	@Autowired
	private HisPrescriptionManager hisPrescriptionManager;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data){
		PrescriptionRecord prescriptionRecord = JSONUtils.deserialize(data, PrescriptionRecord.class);
		HisListResponse<PrescriptionRecord> response = hisPrescriptionManager.getPrescriptionRecords(prescriptionRecord);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	
	@RequestMapping(value = "/info", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDrugDetail(@RequestParam(value = "data", defaultValue = "") String data){
		PrescriptionRecord prescriptionRecord = JSONUtils.deserialize(data, PrescriptionRecord.class);
		HisListResponse<PrescriptionItem> response = hisPrescriptionManager.getPrescription(prescriptionRecord);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	
	@RequestMapping(value = "/print/{prescriptionNo}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forPrinted(@PathVariable("prescriptionNo") String prescriptionNo){
		PrescriptionRecord prescriptionRecord = new PrescriptionRecord();
		prescriptionRecord.setPrescriptionNo(prescriptionNo);
		prescriptionRecord.setHisUserid(this.getCurrentMachine().getHisUser());
		HisResponse response = hisPrescriptionManager.prescriptionRecordPrint(prescriptionRecord);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
}
