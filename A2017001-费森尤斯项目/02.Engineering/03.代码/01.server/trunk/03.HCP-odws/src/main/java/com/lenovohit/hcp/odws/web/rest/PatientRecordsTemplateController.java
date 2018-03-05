package com.lenovohit.hcp.odws.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
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
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.odws.model.PatientRecordsTemplate;

/**
 * 病历模板
 */
@RestController
@RequestMapping("/hcp/odws/patientRecordsTemplate")
public class PatientRecordsTemplateController extends HcpBaseRestController {

	@Autowired
	private GenericManager<PatientRecordsTemplate, String> patientRecordsTemplateManager;

	/**
	 * 分页查询
	 * 
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {

		StringBuilder jql = new StringBuilder("select prt from PatientRecordsTemplate prt  where ");
		List<Object> values = new ArrayList<Object>();
		jql.append(" prt.shareLevel = '3' ");
		jql.append(" or ( prt.shareLevel = '2' and prt.dept.id = ? )");
		jql.append(" or ( prt.shareLevel = '1' and prt.createOper = ? ) ");
		jql.append(" and ( prt.stopFlag = '1') ");
		values.add(this.getCurrentUser().getDeptId());
		values.add(this.getCurrentUser().getName());

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		patientRecordsTemplateManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	// 不分页
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<PatientRecordsTemplate> prts = patientRecordsTemplateManager
				.find(" from PatientRecordsTemplate prt where 1 = 1 order by prt.modelId ");
		return ResultUtils.renderSuccessResult(prts);
	}

	// //加载菜单
	// @RequestMapping(value = "/mylist", method = RequestMethod.GET, produces =
	// MediaTypes.JSON_UTF_8)
	// public Result forMyList() {
	// HcpUser user = this.getCurrentUser();
	// if("00000000000000000000000000000000".equals(user.getId())){
	// return
	// ResultUtils.renderSuccessResult(patientRecordsTemplateManager.findAll());
	// }
	// String sql = "SELECT " + "DISTINCT
	// menu.ID,menu.NAME,menu.ALIAS,menu.Code,menu.PATHNAME,menu.ICON,menu.PARENT,menu.SORT
	// "
	// + "FROM HCP_MENU menu "
	// + "LEFT JOIN HCP_ROLE_MENU_RELA rela ON rela.MENU_ID = menu.ID "
	// + "LEFT JOIN HCP_ROLE role ON rela.ROLE_ID = role.ID "
	// + "LEFT JOIN HCP_USER_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
	// + "WHERE u.USER_ID = ? "
	// + "ORDER BY menu.SORT ";
	// List<?> result = patientRecordsTemplateManager.findBySql(sql,
	// user.getId());
	// List<PatientRecordsTemplate> menus = new
	// ArrayList<PatientRecordsTemplate>();
	// for(Object m : result){
	// Object[] array =( Object[])m;
	// Menu menu = new Menu();
	// menu.setId(Object2String(array[0]));
	// menu.setName(Object2String(array[1]));
	// menu.setAlias(Object2String(array[2]));
	// menu.setCode(Object2String(array[3]));
	// menu.setPathname(Object2String(array[4]));
	// menu.setIcon(Object2String(array[5]));
	// menu.setParent(Object2String(array[6]));
	// menus.add(menu);
	// }
	// return ResultUtils.renderSuccessResult(menus);
	// }
	// 创建
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreatePatientRecordsTemplate(@RequestBody String data) {
		try {
			PatientRecordsTemplate model = JSONUtils.deserialize(data, PatientRecordsTemplate.class);
			model.setPhoneticCode(PinyinUtil.getFirstSpell(model.getModelName()));
			model.setWangCode(WubiUtil.getWBCode(model.getModelName()));
			// TODO 校验
			PatientRecordsTemplate saved = this.patientRecordsTemplateManager.save(model);
			return ResultUtils.renderSuccessResult(saved);
		} catch(Exception e) {
			return ResultUtils.renderFailureResult("保存病历模板出错！");
		}
	}

	// 删除
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeletePatientRecordsTemplate(@PathVariable("id") String id) {
		try {
			this.patientRecordsTemplateManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败2");
		}
		return ResultUtils.renderSuccessResult();
	}

	// 删除多个
	@RequestMapping(value = "/removeAll", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data) {
		System.out.println(data);
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM OW_INQUIRY_RECORD_MODEL  WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			System.out.println(idvalues);
			this.patientRecordsTemplateManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败1");
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 取模板数据生成模板树所需的数据，每种类型限定20条
	 * 
	 * @param searchCode
	 * @return
	 */
	@RequestMapping(value = "/tree/list/{searchCode}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTreeList(@PathVariable("searchCode") String searchCode) {
		// 当前登录用户
		HcpUser user = this.getCurrentUser();

		StringBuffer searchJql = new StringBuffer("and ( phoneticCode like ? or wangCode like ? ) ");

		List<Object> values = new ArrayList<Object>();
		// 取个人模板
		StringBuffer jql = new StringBuffer(" from PatientRecordsTemplate where shareLevel = ? and createOperId = ? ");
		values.add("1");
		values.add(user.getId());
		if (!StringUtils.isEmpty(searchCode) && !"-1".equals(searchCode)) {
			jql.append(searchJql.toString());
			values.add("%" + searchCode.toUpperCase() + "%");
			values.add("%" + searchCode.toUpperCase() + "%");
		}
		List<PatientRecordsTemplate> personalPrts = (List<PatientRecordsTemplate>) patientRecordsTemplateManager
				.findPageList(0, 20, jql.toString(), values.toArray());

		// 取科室模板
		jql = new StringBuffer(" from PatientRecordsTemplate where shareLevel = ? and dept.id = ? ");
		values = new ArrayList<Object>();
		values.add("2");
		values.add(user.getLoginDepartment().getId());
		if (!StringUtils.isEmpty(searchCode) && !"-1".equals(searchCode)) {
			jql.append(searchJql.toString());
			values.add("%" + searchCode.toUpperCase() + "%");
			values.add("%" + searchCode.toUpperCase() + "%");
		}
		List<PatientRecordsTemplate> deptPrts = (List<PatientRecordsTemplate>) patientRecordsTemplateManager
				.findPageList(0, 20, jql.toString(), values.toArray());

		// 取全院模板
		jql = new StringBuffer(" from PatientRecordsTemplate where shareLevel = ? ");
		values = new ArrayList<Object>();
		values.add("3");
		if (!StringUtils.isEmpty(searchCode) && !"-1".equals(searchCode)) {
			jql.append(searchJql.toString());
			values.add("%" + searchCode.toUpperCase() + "%");
			values.add("%" + searchCode.toUpperCase() + "%");
		}
		List<PatientRecordsTemplate> hsptPrts = (List<PatientRecordsTemplate>) patientRecordsTemplateManager
				.findPageList(0, 20, jql.toString(), values.toArray());

		HashMap rtn = new HashMap();
		rtn.put("1", personalPrts);
		//rtn.put("2", deptPrts);
		//rtn.put("3", hsptPrts);

		return ResultUtils.renderSuccessResult(rtn);
	}

	public String Object2String(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
