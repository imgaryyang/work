package com.lenovohit.hwe.treat.web.his;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
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
@RequestMapping("/hwe/treat/his/profile")
public class ProfileHisController extends OrgBaseRestController { 
	@Autowired
	private HisProfileService hisProfileService;
	@Autowired
	private GenericManager<Profile, String> profileManager;
	
	/**    
	 * 功能描述：根据条件查询档案列表
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
//	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
//		Profile model = JSONUtils.deserialize(data, Profile.class);
//		RestListResponse<Profile> response = this.hisProfileService.findList(model, null);
//		if(response.isSuccess())
//			return ResultUtils.renderSuccessResult(response.getList());
//		else 
//			return ResultUtils.renderFailureResult(response.getMsg());
//	}
	/**    
	 * 获取档案信息（测试）          
	*/
	@RequestMapping(value = "/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestBody String data) {
		Map dataMap = JSONUtils.deserialize(data, Map.class);
		if(null == dataMap && dataMap.isEmpty()){
			throw new BaseException("输入数据为空！");
		}
		Object hosNo = dataMap.get("hosNo");
		Object name = dataMap.get("name");
		Object idNo = dataMap.get("idNo");
		if(StringUtils.isEmpty(hosNo)){
			throw new BaseException("医院号不能为空");
		}
		if(StringUtils.isEmpty(name)){
			throw new BaseException("姓名不能为空");
		}
		if(StringUtils.isEmpty(idNo)){
			throw new BaseException("身份证号不能为空");
		}
		List<Profile> list = this.profileManager.find("from Profile where hosNo = ? and name = ? and idNo = ? ", hosNo, name, idNo);
		if(null != list && !list.isEmpty()){
			return ResultUtils.renderSuccessResult(list);
		}
		return ResultUtils.renderFailureResult("您在该医院暂无档案！");
	}
	/**    
	 * 功能描述：根据条件查询档案详情
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	@RequestMapping(value = "/info", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forProfileInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		Profile model = JSONUtils.deserialize(data, Profile.class);
		RestEntityResponse<Profile> response = this.hisProfileService.getInfo(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getEntity());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
}
	
