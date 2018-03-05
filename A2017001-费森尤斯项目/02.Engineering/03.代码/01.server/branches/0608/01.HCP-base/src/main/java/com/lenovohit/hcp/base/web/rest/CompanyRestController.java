package com.lenovohit.hcp.base.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;

@RestController
@RequestMapping("/hcp/base/company")
public class CompanyRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Company, String> companyManager;

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
		try {
			Company query = JSONUtils.deserialize(data, Company.class);
			StringBuilder jql = new StringBuilder("from Company where 1=1 ");
			List<Object> values = new ArrayList<Object>();
	
			if (!StringUtils.isEmpty(query.getCompanyName())) {
				jql.append("and ( UPPER(phoneticCode) like ? or UPPER(wangCode) like ? or UPPER(userSearchCode) like ? or UPPER(companyName) like ? )");
				values.add("%" + query.getCompanyName().trim().toUpperCase() + "%");
				values.add("%" + query.getCompanyName().trim().toUpperCase() + "%");
				values.add("%" + query.getCompanyName().trim().toUpperCase() + "%");
				values.add("%" + query.getCompanyName().trim().toUpperCase() + "%");
			}
			
			// 根据厂商类型检索
			if (!StringUtils.isEmpty(query.getCompanyType())) {
				JSONArray json = JSONArray.parseArray(query.getCompanyType());
				if (json.size() > 0) {
					jql.append("and ( ");
					int i = 0;
					for (Object s : json) {
						if (i > 0) jql.append("or ");
						jql.append("TRIM(companyType) like ? ");
						values.add("%" + (String)s + "%");
						i += 1;
					}
					jql.append(" ) ");
				}
			}
			// 根据厂商服务范围检索
			if (!StringUtils.isEmpty(query.getServices())) {
				JSONArray json = JSONArray.parseArray(query.getServices());
				if (json.size() > 0) {
					jql.append("and ( ");
					int i = 0;
					for (Object s : json) {
						if (i > 0) jql.append("or ");
						jql.append("TRIM(services) like ? ");
						values.add("%" + (String)s + "%");
						i += 1;
					}
					jql.append(" ) ");
				}
			}
			// 根据停用标志检索
			if (!StringUtils.isEmpty(query.getStopFlag())) {
				jql.append("and TRIM(stopFlag) = ? ");
				values.add(query.getStopFlag());
			}
	
			Page page = new Page();
			page.setStart(start);
			page.setPageSize(limit);
			page.setQuery(jql.toString());
			page.setValues(values.toArray());
			companyManager.findPage(page);
			return ResultUtils.renderPageResult(page);
		} catch(Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("查询厂商信息出错！");
		}
	}

	/**
	 * 查询单项
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		Company model = companyManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询列表
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Company> models = companyManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 新建/修改
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@RequestBody String data) {
		try {
			Company model = JSONUtils.deserialize(data, Company.class);
	
			// 处理拼音码及五笔码
			// 设置通用名拼音码和五笔码
			if (!StringUtils.isEmpty(model.getCompanyName()) && StringUtils.isEmpty(model.getCompanySpell()))
				model.setCompanySpell(PinyinUtil.getFirstSpell(model.getCompanyName()));
			if (!StringUtils.isEmpty(model.getCompanyName()) && StringUtils.isEmpty(model.getCompanyWb()))
				model.setCompanyWb(WubiUtil.getWBCode(model.getCompanyName()));
	
			Company saved = this.companyManager.save(model);
			return ResultUtils.renderSuccessResult(saved);
		} catch(Exception e) {
			return ResultUtils.renderFailureResult("保存厂商信息出错！");
		}
	}

	/**
	 * 删除单项
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id) {
		try {
			this.companyManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 删除多项
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/removeSelected", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemoveSelected(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM B_COMPANY WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");

			this.companyManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

}
