package com.lenovohit.ssm.treat.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.lenovohit.ssm.treat.manager.HisAssayManager;
import com.lenovohit.ssm.treat.model.AssayItem;
import com.lenovohit.ssm.treat.model.AssayRecord;
import com.lenovohit.ssm.treat.model.Patient;

/**
 * 化验单
 */
@RestController
@RequestMapping("/ssm/treat/assay")
public class AssayRestController extends BaseRestController {
	
	@Autowired
	private HisAssayManager hisAssayManager;
	
	/**
	 * 化验单列表
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value="/page/{start}/{limit}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		//获取当前患者
		Patient patient = this.getCurrentPatient();
		
		List<AssayRecord> assayRecord = hisAssayManager.getAssayRecordPage(patient);
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		//page.setQuery("from AssayRecord where 1=1 order by sort");
		page.setTotal(assayRecord==null?0:assayRecord.size());
		page.setResult(assayRecord);
		
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * 化验单详情
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/{id}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		List<AssayItem> assayItem = hisAssayManager.getAssayItem(id);
		return ResultUtils.renderSuccessResult(assayItem);
	}
	/**
	 * 打印结果回传
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/printed/{id}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forPrint(@PathVariable("id") String id){
		AssayRecord assayRecord = new AssayRecord();
		assayRecord = hisAssayManager.print(assayRecord);
		
		
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
