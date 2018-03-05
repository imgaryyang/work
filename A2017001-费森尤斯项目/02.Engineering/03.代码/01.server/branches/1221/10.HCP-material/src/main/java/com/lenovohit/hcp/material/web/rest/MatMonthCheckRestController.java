package com.lenovohit.hcp.material.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.material.manager.MonthCheckManager;
import com.lenovohit.hcp.material.model.MatMonthCheck;

@RestController
@RequestMapping("/hcp/material/monthCheck")
public class MatMonthCheckRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<MatMonthCheck, String> matMonthCheckManager;
	@Autowired
	private MonthCheckManager monthCheckManagerImpl;

	/**
	 * 分页查询
	 * 
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		MatMonthCheck query = JSONUtils.deserialize(data, MatMonthCheck.class);
		StringBuilder jql = new StringBuilder( "from MatMonthCheck where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append(" and hosId = ? ");
		values.add(this.getCurrentUser().getHosId());
		
		if(query!=null && query.getMonthcheckTime()!=null){
			jql.append(" and monthcheckTime = ? ");
			values.add(query.getMonthcheckTime());
		}
		jql.append(" order by monthcheckTime desc ");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		matMonthCheckManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	/**    
	 * 功能描述：获取月结时间list
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年8月7日             
	*/
	@RequestMapping(value = "/findMonthCheckTime", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findMonthCheckTime(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Date> dateList = monthCheckManagerImpl.findMonthCheckTime();
		return ResultUtils.renderSuccessResult(dateList);
	}

	/**
	 * 创建月结
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreate(@RequestBody String data) {
		HcpUser user = this.getCurrentUser();
		String msg = monthCheckManagerImpl.addMonthCheck(user);
		if(msg ==null){//没有相关错误信息
			return ResultUtils.renderSuccessResult();
		}else{
			return ResultUtils.renderFailureResult(msg);
		}
	}

}
