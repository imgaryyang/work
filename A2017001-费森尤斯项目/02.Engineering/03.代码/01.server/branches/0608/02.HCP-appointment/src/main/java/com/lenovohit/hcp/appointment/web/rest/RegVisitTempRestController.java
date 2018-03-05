package com.lenovohit.hcp.appointment.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegVisitTemp;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;

@RestController
@RequestMapping("/hcp/appointment/settings/regVisitTemp")
public class RegVisitTempRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<RegVisitTemp, String> regVisitTempManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		RegVisitTemp query = JSONUtils.deserialize(data, RegVisitTemp.class);
		StringBuilder jql = new StringBuilder("from RegVisitTemp where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(query.getDeptId())) {
			jql.append("and deptId = ? ");
			values.add(query.getDeptId());
		}

		if (!StringUtils.isEmpty(query.getWeek())) {
			jql.append("and week = ? ");
			values.add(query.getWeek());
		}

		jql.append("order by noon");

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		regVisitTempManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		RegVisitTemp model = regVisitTempManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<RegVisitTemp> models = regVisitTempManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreateMenu(@RequestBody String data) {
		RegVisitTemp model = JSONUtils.deserialize(data, RegVisitTemp.class);
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setCreateOper(user.getName());
		model.setCreateTime(now);
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		// TODO 校验
		RegVisitTemp saved = this.regVisitTempManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		RegVisitTemp model = JSONUtils.deserialize(data, RegVisitTemp.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		this.regVisitTempManager.save(model);
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id) {
		try {
			this.regVisitTempManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/removeAll", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM REG_VISITMODEL WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.regVisitTempManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/get/deptType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getdeptType() {
		String hosId = this.getCurrentUser().getHosId();
		StringBuilder sql = new StringBuilder("from Department where 1=1 and hosId = ? and isRegdept = '1'");
		List<Department> departments = departmentManager.find(sql.toString(), hosId);
		HashMap<String, String> result = new HashMap<String, String>();
		for (Department d : departments) {
			result.put(d.getId(), d.getDeptName());
		}
		return ResultUtils.renderSuccessResult(result);

	}
}
