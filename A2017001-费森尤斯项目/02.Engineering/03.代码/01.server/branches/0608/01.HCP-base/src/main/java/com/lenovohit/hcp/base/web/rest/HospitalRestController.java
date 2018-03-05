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

import com.alibaba.druid.sql.dialect.odps.ast.OdpsAddStatisticStatement;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;

/**
 * 医院基本信息管理
 */
@RestController
@RequestMapping("/hcp/base/hospital")
public class HospitalRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Hospital query = JSONUtils.deserialize(data, Hospital.class);
		StringBuilder jql = new StringBuilder("from Hospital where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosName like ? ");
			values.add("%" + query.getHosName() + "%");
		}
		if (!StringUtils.isEmpty(query.getSpellCode())) {
			jql.append("and spellCode like ? ");
			values.add("%" + query.getSpellCode() + "%");
		}
		if (!StringUtils.isEmpty(query.getWbCode())) {
			jql.append("and wbCode like ? ");
			values.add("%" + query.getWbCode() + "%");
		}
		if (!StringUtils.isEmpty(query.getParentId())) {
			jql.append("and parentId like ? ");
			values.add("%" + query.getParentId() + "%");
		}
		if (!StringUtils.isEmpty(query.getHosArea())) {
			jql.append("and hosArea like ? ");
			values.add("%" + query.getHosArea() + "%");
		}
		if (!StringUtils.isEmpty(query.getHosGrade())) {
			jql.append("and hosGrade like ? ");
			values.add("%" + query.getHosGrade() + "%");
		}
		if (!StringUtils.isEmpty(query.getHosType())) {
			jql.append("and hosType like ? ");
			values.add("%" + query.getHosType() + "%");
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		hospitalManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		Hospital hospital = hospitalManager.get(id);
		return ResultUtils.renderPageResult(hospital);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Hospital> menus = hospitalManager.findAll();
		return ResultUtils.renderSuccessResult(menus);
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreateMenu(@RequestBody String data) {
		Hospital model = JSONUtils.deserialize(data, Hospital.class);
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setCreateOper(user.getName());
		model.setCreateTime(now);
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		if (model.getSpellCode() == null)
			model.setSpellCode(PinyinUtil.getFirstSpell(model.getHosName()));
		if (model.getWbCode() == null)
			model.setWbCode(WubiUtil.getWBCode(model.getHosName()));
		// TODO 校验
		Hospital saved = this.hospitalManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Hospital model = JSONUtils.deserialize(data, Hospital.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult();
		}
		Hospital old = hospitalManager.get(model.getId());
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setCreateTime(old.getCreateTime());
		model.setCreateOper(old.getCreateOper());
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		this.hospitalManager.save(model);

		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id) {
		try {
			this.hospitalManager.delete(id);
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
			idSql.append("DELETE FROM B_HOSINFO  WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.hospitalManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/type/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTypeList(@RequestParam(value = "data", defaultValue = "") String data) {
		String columnName;
		columnName = "PARENT_ID";
		System.console();
		List<Dictionary> models = dictionaryManager.find(
				" select distinct dict.columnDis as columnDis, dict.columnKey as columnKey, dict.columnVal as columnValue from Dictionary dict where 1 = 1 and dict.columnName = ? ",
				columnName);
		return ResultUtils.renderSuccessResult(models);
	}

	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

	@RequestMapping(value = "/listEdit", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forEdit(@RequestParam(value = "data", defaultValue = "") String data) {
//		List<Hospital> menus = hospitalManager.findAll();
//		return ResultUtils.renderSuccessResult(menus);
		HcpUser user = this.getCurrentUser();
		StringBuilder jql = new StringBuilder("from Hospital where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(user.getHosId())) {
			jql.append("and hosId = ?");
			values.add(user.getHosId());
		}		
		Page page = new Page();
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		hospitalManager.findPage(page);
		return ResultUtils.renderSuccessResult(page);

	}

}
