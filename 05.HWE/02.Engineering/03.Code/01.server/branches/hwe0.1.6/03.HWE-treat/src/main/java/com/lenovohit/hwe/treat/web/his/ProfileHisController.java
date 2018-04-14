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
import com.lenovohit.hwe.treat.model.Profile;
import com.lenovohit.hwe.treat.service.HisProfileService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**    
 *         
 * 类描述：    档案相关处理
 *@author GW
 *@date 2018年2月1日          
 *     
 */
@RestController
@RequestMapping("/hwe/treat/his/profile/")
public class ProfileHisController extends OrgBaseRestController { 
	@Autowired
	private HisProfileService hisProfileService;
	
	/**    
	 * 功能描述：根据条件查询档案列表
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	@RequestMapping(value = "list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Profile model = JSONUtils.deserialize(data, Profile.class);
		RestListResponse<Profile> response = this.hisProfileService.findList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
	
	/**    
	 * 功能描述：根据条件查询档案详情
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	@RequestMapping(value = "info", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forProfileInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		Profile model = JSONUtils.deserialize(data, Profile.class);
		RestEntityResponse<Profile> response = this.hisProfileService.getInfo(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getEntity());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
}
	
