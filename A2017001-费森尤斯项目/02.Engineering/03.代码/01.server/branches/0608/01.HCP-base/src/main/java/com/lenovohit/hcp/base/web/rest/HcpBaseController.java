package com.lenovohit.hcp.base.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.manager.SearchInputManager;
import com.lenovohit.hcp.base.model.CommonItemInfo;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.Diagnosis;
import com.lenovohit.hcp.base.model.Frequency;
import com.lenovohit.hcp.base.model.SearchInput;
import com.lenovohit.hcp.material.model.MatCertificate;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;

@RestController
@RequestMapping("/hcp/base")
public class HcpBaseController {

	@Autowired
	private GenericManager<CommonItemInfo, String> commonItemInfoManager;
	
	@Autowired
	private GenericManager<Diagnosis, String> diagnosisManager;
	private static final Map<String, String> searchInputMap = new HashMap<>();

	@Autowired
	private GenericManager<Diagnosis, String> frequencyManager;
	
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	
	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;

	@Autowired
	private GenericManager<Company, String> matCompanyInfoManager;

	@Autowired
	private GenericManager<MatCertificate, String> materialCertificateManager;

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
	 * 根据条件查询通用收费项
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/commonItem/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@RequestBody String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from CommonItemInfo where 1=1 ");
		if (jsonObj != null) {
			String type = jsonObj.getString("type"); // 项目类型（收费项(1) 药品(0)）
			String searchCode = jsonObj.getString("searchCode");
			String drugType = jsonObj.getString("drugFlag"); // 1西药/成药 2草药 3非药
			String drugDept = jsonObj.getString("deptId"); // 药品科室id
			if (StringUtils.isNotBlank(type) && !("-1".equals(type))) {// "-1"检索所有信息
				jql.append(" and itemFlag = ? ");
				values.add(type);
			}
			if (StringUtils.isNotBlank(searchCode)) {
				jql.append(" and ( tradeSpell like ? or  commonSpell like ? or commonWb like ? or tradeWb like ? ) ");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
			}

			if (StringUtils.isNotBlank(drugType) && !"-1".equals(drugType)) {// -1为默认查询全部
				if ("1".equals(drugType)) {
					jql.append(" and ( feeCode = ? or  feeCode = ? ) ");
					values.add("001");
					values.add("002");
				}
				if ("2".equals(drugType)) {
					jql.append(" and feeCode = ? ");
					values.add("003");
				}
				if ("3".equals(drugType)) {// 非药品
					jql.append(" and feeCode != ?  and feeCode != ?  and feeCode != ? ");
					values.add("001");
					values.add("002");
					values.add("003");
				}
			}

			if (StringUtils.isNotBlank(drugDept) && !"3".equals(drugType)) {
				jql.append(" and exeDept = ? ");
				values.add(drugDept);
			}
		}
		List<CommonItemInfo> itemList = (List<CommonItemInfo>) commonItemInfoManager.findPageList(0, 20, jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(itemList);
	}

	/**
	 * 根据拼音码或五笔码查询诊断信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/diagnosis/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forDiagnosisPage(@RequestBody String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from Diagnosis where 1=1 ");
		if (jsonObj != null) {
			String searchCode = jsonObj.getString("searchCode");
			if (StringUtils.isNotEmpty(searchCode)) {
				jql.append(" and ( phoneticCode like ? or wangCode like ? ) ");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
			}
		}
		List<Diagnosis> itemList = (List<Diagnosis>) diagnosisManager.findPageList(0, 20, jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(itemList);
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
			result = manager.listSearchInput(code);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取检索信息失败，信息为：" + e.getMessage());
		}
		return ResultUtils.renderPageResult(result);
	}

	/**
	 * 根据拼音码或五笔码查询频次信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/freq/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forFrequencyPage(@RequestBody String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from Frequency where 1=1 ");
		if (jsonObj != null) {
			String searchCode = jsonObj.getString("searchCode");
			if (StringUtils.isNotEmpty(searchCode)) {
				jql.append(" and ( spellCode like ? or wbCode like ? ) ");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
			}
		}
		List<Frequency> itemList = (List<Frequency>) frequencyManager.findPageList(0, 20, jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(itemList);
	}

	/**
	 * 功能描述：通过姓名或挂号流水查询挂号信息
	 * 
	 * @param data
	 * @return
	 * @author gw
	 * @date 2017年5月4日
	 */
	@RequestMapping(value = "/regInfo/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRegInfoPage(@RequestBody String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from RegInfo ri where 1=1 ");

		if (jsonObj != null) {
			String searchCode = jsonObj.getString("searchCode");
			if (StringUtils.isNotBlank(searchCode)) {
				jql.append(" and ( regId like ?  ");
				values.add("%" + searchCode.toUpperCase() + "%");
				jql.append(" or  ri.patient.id in (select id from Patient where name like ? ) ");
				values.add("%" + searchCode.toUpperCase() + "%");
				jql.append(")");
			}
		}
		List<RegInfo> itemList = (List<RegInfo>) regInfoManager.findPageList(0, 20, jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(itemList);
	}

	/**
	 * 功能描述：通过名称、拼音、五笔等查询药品信息
	 * 
	 * @param data
	 * @return
	 * @author gw
	 * @date 2017年5月4日
	 */
	@RequestMapping(value = "/drugInfo/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forDrugInfoPage(@RequestBody String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from PhaDrugInfo where 1=1 ");

		if (jsonObj != null) {
			String searchCode = jsonObj.getString("searchCode");
			if (StringUtils.isNotBlank(searchCode)) {
				jql.append(
						"and ( commonName like ? or commonSpell like ? or commonWb like ? or tradeName like ? or tradeSpell like ? or tradeWb like ? )");
				values.add("%" + searchCode.trim().toUpperCase() + "%");
				values.add("%" + searchCode.trim().toUpperCase() + "%");
				values.add("%" + searchCode.trim().toUpperCase() + "%");
				values.add("%" + searchCode.trim().toUpperCase() + "%");
				values.add("%" + searchCode.trim().toUpperCase() + "%");
				values.add("%" + searchCode.trim().toUpperCase() + "%");
			}
		}
		List<PhaDrugInfo> itemList = (List<PhaDrugInfo>) phaDrugInfoManager.findPageList(0, 20, jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(itemList);
	}
	
	/**
	 * 根据条件查询物资厂商
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/materialCompany/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forMaterialCompanyPage(@RequestBody String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from MatCompanyInfo where 1=1 ");
		if (jsonObj != null) {
			
			String searchCode = jsonObj.getString("searchCode");
			String companyType = jsonObj.getString("companyType"); // 1 - 生产厂商， 2 - 供应商
			
			if (!StringUtils.isEmpty(searchCode)) {
				jql.append(" and ( companyName like ? or  companySpell like ? or companyWb like ? ) ");
				values.add("%" + searchCode + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
			}

			if (!StringUtils.isEmpty(companyType)) {
				jql.append(" and companyType = ? ");
				values.add(companyType);
			}
		}
		List<Company> itemList = (List<Company>)matCompanyInfoManager.findPageList(0, 20, jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(itemList);
	}
	
	/**
	 * 根据条件查询物资证书
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/materialCertificate/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forMaterialCertificatePage(@RequestBody String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from MatCertificate where 1=1 ");
		if (jsonObj != null) {
			
			String searchCode = jsonObj.getString("searchCode");
			
			if (!StringUtils.isEmpty(searchCode)) {
				jql.append(" and ( regName like ? or regNo like ? ) ");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
			}

		}
		List<MatCertificate> itemList = (List<MatCertificate>)materialCertificateManager.findPageList(0, 20, jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(itemList);
	}
	

	
	/**
	 * 根据条件查询物资
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/materials/list", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forMaterialsPage(@RequestBody String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from MatInfo where 1=1 ");
		if (jsonObj != null) {
			
			String searchCode = jsonObj.getString("searchCode");
			
			if (!StringUtils.isEmpty(searchCode)) {
				jql.append(" and ( commonName like ? or commonSpell like ? or commonWb like ? or alias like ? or aliasSpell like ? or aliasWb like ? ) ");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
				values.add("%" + searchCode.toUpperCase() + "%");
			}

		}
		List<MatCertificate> itemList = (List<MatCertificate>)materialCertificateManager.findPageList(0, 20, jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(itemList);
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
					jql.append("and ( UPPER(phoneticCode) like ? or UPPER(wangCode) like ? or UPPER(userSearchCode) like ? or UPPER(companyName) like ? )");
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
