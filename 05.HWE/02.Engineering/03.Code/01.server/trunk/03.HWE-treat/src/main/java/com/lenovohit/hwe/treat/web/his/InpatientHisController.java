package com.lenovohit.hwe.treat.web.his;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.InChargeDetail;
import com.lenovohit.hwe.treat.model.Inpatient;
import com.lenovohit.hwe.treat.service.HisInChargeDetailService;
import com.lenovohit.hwe.treat.service.HisInpatientService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**    
 *         
 * 类描述：    住院患者信息相关处理
 *@author GW
 *@date 2018年2月1日          
 *     
 */
@RestController
@RequestMapping("/hwe/treat/his/inpatient/")
public class InpatientHisController extends OrgBaseRestController { 
	@Autowired
	private HisInpatientService hisInpatientService;
	
	@Autowired
	private HisInChargeDetailService hisInChargeDetailService;
	
	/**    
	 * 功能描述：根据病人编号、医院编号查询患者当前住院单
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	@RequestMapping(value = "info", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		Inpatient model = JSONUtils.deserialize(data, Inpatient.class);
		RestEntityResponse<Inpatient> response = this.hisInpatientService.getInfo(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getEntity());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
	
	/**    
	 * 功能描述：查询患者住院日清单
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	@RequestMapping(value = "dailyList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDailyList(@RequestParam(value = "data", defaultValue = "") String data) {
		Inpatient model = JSONUtils.deserialize(data, Inpatient.class);
		RestListResponse<InChargeDetail> response = this.hisInChargeDetailService.findDailyList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
	
}
	
