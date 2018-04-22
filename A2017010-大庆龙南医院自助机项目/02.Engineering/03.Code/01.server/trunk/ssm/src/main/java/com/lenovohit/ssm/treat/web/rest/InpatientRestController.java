package com.lenovohit.ssm.treat.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.treat.manager.HisInpatientManager;
import com.lenovohit.ssm.treat.model.Inpatient;
import com.lenovohit.ssm.treat.model.InpatientBill;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

/**
 * 住院病人
 */
@RestController
@RequestMapping("/ssm/treat/inpatient")
public class InpatientRestController extends BaseRestController {
	
	@Autowired
	private HisInpatientManager hisInpatientManager;

	/**
	 * 住院基本信息查询/{patientId}
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/info",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPatientInfo(@RequestParam(value = "data", defaultValue = "") String data){
		Inpatient searchInfo =  JSONUtils.deserialize(data, Inpatient.class);
		HisListResponse<Inpatient> response = null;
		if(!StringUtils.isEmpty(searchInfo.getPatientNo())){
			response = hisInpatientManager.getInpatientByPatientNo(searchInfo);
		}
	    if(!StringUtils.isEmpty(searchInfo.getInpatientId())){
	    	response = hisInpatientManager.getInpatientByInpatientId(searchInfo);
	    }
	    
	    if(null != response && response.isSuccess()){
	    	if(null != response.getList() && response.getList().size() != 1){
	    		return ResultUtils.renderFailureResult("获取到多个在院病人！");
	    	}
			return ResultUtils.renderSuccessResult(response.getList().get(0)); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	
	/**
	 * 日结清单
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/dailyBill/list/{billDate}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result dailyBillList(@RequestParam(value = "data", defaultValue = "") String data, @PathVariable("billDate") String billDate){
		/*InpatientInfo baseInfo =  JSONUtils.deserialize(data, InpatientInfo.class);
		List<InpatientDailyBillDetail> bills = hisInpatientManager.getDailyBill(baseInfo, billDate);
		return ResultUtils.renderSuccessResult(bills);*/
		return null;
	}
	/**
	 * 住院费用
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/inpatientBill/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result inpatientBillList(@RequestParam(value = "data", defaultValue = "") String data){
		Inpatient inpatient =  JSONUtils.deserialize(data, Inpatient.class);
		HisListResponse<InpatientBill> response = hisInpatientManager.getInpatientBill(inpatient);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	
	/**
	 * 预缴余额查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/deposit/balance",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result billList(@RequestParam(value = "data", defaultValue = "") String data){
		/*BigDecimal balance = hisInpatientManager.depositBalance(this.getCurrentPatient());
		return ResultUtils.renderSuccessResult(balance);*/
		return null;
	}
	
}
