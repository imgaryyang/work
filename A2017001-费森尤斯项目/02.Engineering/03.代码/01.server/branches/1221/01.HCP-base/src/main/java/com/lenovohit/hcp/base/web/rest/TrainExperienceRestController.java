package com.lenovohit.hcp.base.web.rest;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.TrainExperience;

/**
 * 用户培训经历管理
 */
@RestController
@RequestMapping("/hcp/base/trainExperience")
public class TrainExperienceRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	private GenericManager<TrainExperience, String> trainExperienceManager;
	
	/**    
	 * 功能描述：根据用户id查询用户培训经历
	 *@param userId
	 *@return       
	 *@author GW
	 *@date 2017年7月17日             
	*/
	@RequestMapping(value = "/listByUser/{userId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUserAccounts(@PathVariable("userId") String userId) {
		HcpUser user = this.hcpUserManager.get(userId);
		HcpUser current = this.getCurrentUser();
		if(user == null)return ResultUtils.renderFailureResult("不存在的用户");
		if(!user.getHosId().equals(current.getHosId()))return ResultUtils.renderFailureResult("不允许修改其他医院的用户账户信息");
		List<TrainExperience> models = trainExperienceManager.find("from TrainExperience account where userId = ? ", userId);
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**    
	 * 功能描述：创建培训经历
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月17日             
	*/
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		TrainExperience model =  JSONUtils.deserialize(data, TrainExperience.class);
		if(model!=null && model.getUserId()!=null){
			TrainExperience saved = trainExperienceManager.save(model);
			return ResultUtils.renderSuccessResult(saved);
		} else {
			System.err.println("培训经历中用户id为空");
			return ResultUtils.renderFailureResult("保存失败！");
		}
	}
	
	/**
	 * 删除登录账户
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			trainExperienceManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
}
