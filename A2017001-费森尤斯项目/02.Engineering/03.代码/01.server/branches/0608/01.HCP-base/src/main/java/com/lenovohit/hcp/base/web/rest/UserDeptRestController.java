package com.lenovohit.hcp.base.web.rest;

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
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUserDept;
import com.lenovohit.hcp.base.utils.PinyinUtil;

/**
 * 用户科室信息
 */
@RestController
@RequestMapping("/hcp/base/userDept")
public class UserDeptRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<HcpUserDept, String> hcpUserDeptManager;

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<HcpUserDept> models = hcpUserDeptManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 根据科室取医生
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listByDept", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListByDept(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		HcpUserDept model = JSONUtils.deserialize(data, HcpUserDept.class);
		StringBuilder jql = new StringBuilder();
		List<Object> values = new ArrayList<Object>();
		jql.append("from HcpUserDept where 1=1");
		
		if( StringUtils.isNotEmpty(model.getDeptId())){
			jql.append(" and deptId = ? ");
			values.add(model.getDeptId());
		}
		List<HcpUserDept> models = (List<HcpUserDept>) hcpUserDeptManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
}
