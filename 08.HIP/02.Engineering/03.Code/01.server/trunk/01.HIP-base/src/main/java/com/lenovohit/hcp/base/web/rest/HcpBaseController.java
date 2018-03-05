package com.lenovohit.hcp.base.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.SearchInputManager;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.SearchInput;

@RestController
@RequestMapping("/hcp/base")
public class HcpBaseController extends HcpBaseRestController {

	private static final Map<String, String> searchInputMap = new HashMap<>();

	
	@Autowired
	private GenericManager<Company, String> companyManager;
	
	static {
		// TODO searchinput的code值，前后台定完code。对应code的实现类（后期如果考虑不修改代码可以写到配置文件加载即可）
		searchInputMap.put("companyInfo", "companyInfoSearchInputManager");
		searchInputMap.put("companyInfoSupply", "companyInfoSupplySearchInputManager");
		searchInputMap.put("materialCompanyInfoSupply", "materialCompanyInfoSupplySearchInputManager");
		searchInputMap.put("frequency", "freqSearchInputManager");
		searchInputMap.put("hcpUserCashier", "hcpUserCashierSearchInputManager");// 收款员
		searchInputMap.put("hcpUserDoc", "hcpUserDocSearchInputManager");
		searchInputMap.put("hcpUser", "hcpUserSearchInputManager");
		searchInputMap.put("hosInfo", "hosInfoSearchInputManager");
	}

	

	

	/**
	 * 公共查询检索条件方法，不用每个查询编写自己的方法，统一定code调用即可。
	 * 
	 * @param code
	 * @return
	 */
	@RequestMapping(value = "/searchInput/{code}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getSearchInput(@PathVariable String code) {
		String searchInputManager = searchInputMap.get(code);
		if (StringUtils.isBlank(searchInputManager))
			return ResultUtils.renderFailureResult("没有对应code的处理manager");
		SearchInputManager manager = (SearchInputManager) SpringUtils.getBean(searchInputManager);
		if (manager == null)
			return ResultUtils.renderFailureResult("不存在code对应的处理manager");
		Map<String, SearchInput> result = null;
		try {
			result = manager.listSearchInput(code,this.getCurrentUser().getHosId());
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取检索信息失败，信息为：" + e.getMessage());
		}
		return ResultUtils.renderPageResult(result);
	}

	
	/**
	 * 根据条件查询公用厂商信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/companies/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forCompaniesPage(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			JSONObject jsonObj = JSONObject.parseObject(data);
			// Company query = JSONUtils.deserialize(data, Company.class);
			StringBuilder jql = new StringBuilder("from Company where 1=1 ");
			List<Object> values = new ArrayList<Object>();

			if (jsonObj != null) {
				
				String searchCode = jsonObj.getString("searchCode");
				String companyType = jsonObj.getString("companyType"); // 1 - 生产厂商， 2 - 供应商
				String services = jsonObj.getString("services");
				
				if (!StringUtils.isEmpty(searchCode)) {
					jql.append("and ( UPPER(companySpell) like ? or UPPER(companyWb) like ? or UPPER(userSearchCode) like ? or UPPER(companyName) like ? )");
					values.add("%" + searchCode.trim().toUpperCase() + "%");
					values.add("%" + searchCode.trim().toUpperCase() + "%");
					values.add("%" + searchCode.trim().toUpperCase() + "%");
					values.add("%" + searchCode.trim().toUpperCase() + "%");
				}
				
				// 根据厂商类型检索
				if (!StringUtils.isEmpty(companyType)) {
					JSONArray json = JSONArray.parseArray(companyType);
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
				if (!StringUtils.isEmpty(services)) {
					JSONArray json = JSONArray.parseArray(services);
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
			}
			
			Page page = new Page();
			page.setStart(0);
			page.setPageSize(20);
			page.setQuery(jql.toString());
			page.setValues(values.toArray());
			companyManager.findPage(page);
			return ResultUtils.renderPageResult(page);
		} catch(Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("查询厂商信息出错！");
		}
	}
}
