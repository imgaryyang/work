package com.lenovohit.hcp.base.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
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
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.ChargeDetail;
import com.lenovohit.hcp.base.model.ChargePkg;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;

/**
 * 收费套餐维护
 */
@RestController
@RequestMapping("/hcp/base/chargePkg")
public class ChargePkgRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<ChargePkg, String> chargePkgManager;
	
	@Autowired
	private GenericManager<ChargeDetail, String> chargeDetailManager;
	
	@Autowired
	private IRedisSequenceManager redisSequenceManager;

	/**
	 * 查询组套列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/findChargePkgList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findChargePkgList(@RequestParam(value = "data", defaultValue = "") String data) {
		ChargePkg query = JSONUtils.deserialize(data, ChargePkg.class);
		StringBuilder jql = new StringBuilder("from ChargePkg where stop = '0' ");
		List<Object> values = new ArrayList<Object>();
		// 套餐中有模板归类的
		jql.append(" and ( shareLevel = '1' or  shareLevel = '2' or shareLevel = '3' ) ");

		if (StringUtils.isNotEmpty(query.getComboName())) {
			jql.append(" and ( comboName like ? or  spellCode like ? or wbCode like ? or userCode like ? ) ");
			values.add("%" + query.getComboName() + "%");
			values.add("%" + query.getComboName() + "%");
			values.add("%" + query.getComboName() + "%");
			values.add("%" + query.getComboName() + "%");
		}
		List<ChargePkg> chargePkgList = (List<ChargePkg>) chargePkgManager.findPageList(0, 20, jql.toString(), values.toArray());
		Map<String, List<ChargePkg>> mapList = new HashMap<String, List<ChargePkg>>();
		for (ChargePkg charge : chargePkgList) {
			String shareLevel = charge.getShareLevel();
			List<ChargePkg> list = mapList.get(shareLevel);
			if (list != null) {
				list.add(charge);
			} else {
				list = new ArrayList<ChargePkg>();
				list.add(charge);
				mapList.put(shareLevel, list);
			}
		}
		return ResultUtils.renderPageResult(mapList);
	}
	
	/**
	 * 根据查询条件分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{chanel}/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("chanel") String chanel,@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		ChargePkg query = JSONUtils.deserialize(data, ChargePkg.class);
		StringBuilder jql = new StringBuilder("from ChargePkg where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());
		
		if (!StringUtils.isEmpty(query.getBusiClass())) {
			jql.append("and busiClass = ? ");
			values.add(query.getBusiClass());
		}
		
		if (StringUtils.isNotEmpty(query.getShareLevel())) {
			jql.append("and shareLevel = ? ");
			values.add(query.getShareLevel());
		}
		
		if (StringUtils.isNotEmpty(query.getDrugFlag())) {
			jql.append("and drugFlag = ? ");
			values.add(query.getDrugFlag());
		}
		
		if (!StringUtils.isEmpty(query.getComboName())) {
			jql.append("and comboName like ? ");
			values.add("%" + query.getComboName() + "%");
		}
		
		if (null != query.getUseDept() && !StringUtils.isEmpty(query.getUseDept().getId())) {
			jql.append("and useDept.id = ? ");
			values.add(query.getUseDept().getId());
		}

		if(StringUtils.isNotBlank(chanel)&&"person".equals(chanel)){
			jql.append("and createOperId = ? ");
			values.add(this.getCurrentUser().getId());
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		chargePkgManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	/**
	 * 取组套数据生成组套树所需的数据 shareLevel - 共享级别 ：1 - 个人；2 - 部门；3 - 全院 busiClass -
	 * 业务分类：1 - 收费记账；2 - 医生站
	 * 
	 * @param searchCode
	 * @param pageSize
	 * @return
	 */
	@RequestMapping(value = "/tree/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTreeList(@RequestParam(value = "data", defaultValue = "") String data) {
		
		// 当前登录用户
		HcpUser user = this.getCurrentUser();
		JSONObject json = JSONObject.parseObject(data);
		String busiClass = json.getString("busiClass");
		String drugFlag = json.getString("drugFlag");
		String searchCode = json.getString("searchCode");
		String pageSize = StringUtils.isEmpty(json.getString("pageSize")) ? "20" : json.getString("pageSize");

		String baseJql = " from ChargePkg where busiClass = ? and shareLevel = ? ";
		if (!StringUtils.isEmpty(drugFlag)) baseJql += "and drugFlag = ? ";
		StringBuffer jql = new StringBuffer("");
		List<Object> values = new ArrayList<Object>();

		Map<String, HashMap<String, List<ChargePkg>>> rtn = new HashMap<String, HashMap<String, List<ChargePkg>>>();
		
		// 业务类型为空或为财务
		if (StringUtils.isEmpty(busiClass) || ChargePkg.BIZ_CLASS_FINANCE.equals(busiClass)) {

			// 取财务收费个人模板
			jql = new StringBuffer(baseJql).append("and createOperId = ? ");
			values = new ArrayList<Object>();
			values.add(ChargePkg.BIZ_CLASS_FINANCE);
			values.add(ChargePkg.SHARE_LEVEL_PERSONAL);
			if (!StringUtils.isEmpty(drugFlag)) values.add(drugFlag);
			values.add(user.getId());
			this.appendSearchJql(jql, searchCode, values);
			List<ChargePkg> financePersonalList = (List<ChargePkg>) chargePkgManager.findPageList(0,
					Integer.parseInt(pageSize), jql.toString(), values.toArray());

			// 取财务收费部门模板
			jql = new StringBuffer(baseJql).append("and useDept.id = ? ");
			values = new ArrayList<Object>();
			values.add(ChargePkg.BIZ_CLASS_FINANCE);
			values.add(ChargePkg.SHARE_LEVEL_DEPARTMENT);
			if (!StringUtils.isEmpty(drugFlag)) values.add(drugFlag);
			values.add(user.getLoginDepartment().getId());
			this.appendSearchJql(jql, searchCode, values);
			List<ChargePkg> financeDepartmentList = (List<ChargePkg>) chargePkgManager.findPageList(0,
					Integer.parseInt(pageSize), jql.toString(), values.toArray());

			// 取财务收费全院模板
			jql = new StringBuffer(baseJql);
			values = new ArrayList<Object>();
			values.add(ChargePkg.BIZ_CLASS_FINANCE);
			values.add(ChargePkg.SHARE_LEVEL_HOSPITAL);
			if (!StringUtils.isEmpty(drugFlag)) values.add(drugFlag);
			this.appendSearchJql(jql, searchCode, values);
			List<ChargePkg> financeHospitalList = (List<ChargePkg>) chargePkgManager.findPageList(0,
					Integer.parseInt(pageSize), jql.toString(), values.toArray());
			
			// 使用map存储财务收费相关的组套
			HashMap<String, List<ChargePkg>> fMap = new HashMap<String, List<ChargePkg>>();
			fMap.put(ChargePkg.SHARE_LEVEL_PERSONAL, financePersonalList);
			fMap.put(ChargePkg.SHARE_LEVEL_DEPARTMENT, financeDepartmentList);
			fMap.put(ChargePkg.SHARE_LEVEL_HOSPITAL, financeHospitalList);
			rtn.put(ChargePkg.BIZ_CLASS_FINANCE, fMap);
		}
		
		// 业务类型为空或为医生
		if (StringUtils.isEmpty(busiClass) || ChargePkg.BIZ_CLASS_DOC.equals(busiClass)) {
			// 取医生站个人模板
			jql = new StringBuffer(baseJql).append("and createOperId = ? ");
			values = new ArrayList<Object>();
			values.add(ChargePkg.BIZ_CLASS_DOC);
			values.add(ChargePkg.SHARE_LEVEL_PERSONAL);
			if (!StringUtils.isEmpty(drugFlag)) values.add(drugFlag);
			values.add(user.getId());
			this.appendSearchJql(jql, searchCode, values);
			List<ChargePkg> docPersonalList = (List<ChargePkg>) chargePkgManager.findPageList(0, Integer.parseInt(pageSize),
					jql.toString(), values.toArray());

			// 取医生站部门模板
			jql = new StringBuffer(baseJql).append("and useDept.id = ? ");
			values = new ArrayList<Object>();
			values.add(ChargePkg.BIZ_CLASS_DOC);
			values.add(ChargePkg.SHARE_LEVEL_DEPARTMENT);
			if (!StringUtils.isEmpty(drugFlag)) values.add(drugFlag);
			values.add(user.getLoginDepartment().getId());
			this.appendSearchJql(jql, searchCode, values);
			List<ChargePkg> docDepartmentList = (List<ChargePkg>) chargePkgManager.findPageList(0,
					Integer.parseInt(pageSize), jql.toString(), values.toArray());

			// 取医生站全院模板
			jql = new StringBuffer(baseJql);
			values = new ArrayList<Object>();
			values.add(ChargePkg.BIZ_CLASS_DOC);
			values.add(ChargePkg.SHARE_LEVEL_HOSPITAL);
			if (!StringUtils.isEmpty(drugFlag)) values.add(drugFlag);
			this.appendSearchJql(jql, searchCode, values);
			List<ChargePkg> docHospitalList = (List<ChargePkg>) chargePkgManager.findPageList(0, Integer.parseInt(pageSize),
					jql.toString(), values.toArray());

			// 使用map存储医生站相关的组套
			HashMap<String, List<ChargePkg>> dMap = new HashMap<String, List<ChargePkg>>();
			dMap.put(ChargePkg.SHARE_LEVEL_PERSONAL, docPersonalList);
			dMap.put(ChargePkg.SHARE_LEVEL_DEPARTMENT, docDepartmentList);
			dMap.put(ChargePkg.SHARE_LEVEL_HOSPITAL, docHospitalList);

			rtn.put(ChargePkg.BIZ_CLASS_DOC, dMap);
		}

		return ResultUtils.renderSuccessResult(rtn);
	}

	/**
	 * 扩展拼音码、五笔码、自定义码查询条件
	 * 
	 * @param jql
	 * @param searchCode
	 * @param values
	 */
	private void appendSearchJql(StringBuffer jql, String searchCode, List<Object> values) {
		String searchJql = "and ( spellCode like ? or wbCode like ? or userCode like ? ) ";
		if (!StringUtils.isEmpty(searchCode) && !"-1".equals(searchCode)) {
			jql.append(searchJql);
			values.add("%" + searchCode.toUpperCase() + "%");
			values.add("%" + searchCode.toUpperCase() + "%");
			values.add("%" + searchCode.toUpperCase() + "%");
		}
	}
	
	/**
	 * 保存组套信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSaveGroup(@RequestBody String data) {
		ChargePkg model = JSONUtils.deserialize(data, ChargePkg.class);
		// 修改
		if (!StringUtils.isEmpty(model.getId())) {
			ChargePkg modelInDb = this.chargePkgManager.get(model.getId());
			// 药品标识发生改变，需先删除所有明细
			if (!modelInDb.getDrugFlag().equals(model.getDrugFlag())) {
				List<Object> values = new ArrayList<Object>();
				values.add(modelInDb.getId());
				this.chargePkgManager.executeSql("delete from ITEM_GROUP_DETAIL where COMBO_ID = ? ", values.toArray());
			}
		}
		
		model.setSpellCode(PinyinUtil.getFirstSpell(model.getComboName()));
		model.setWbCode(WubiUtil.getWBCode(model.getComboName()));
		
		ChargePkg saved = this.chargePkgManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}
	
	/**
	 * 保存组套明细信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/item/save", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSaveItem(@RequestBody String data) {
		// 当前登录用户
		HcpUser user = this.getCurrentUser();
		ChargeDetail model = JSONUtils.deserialize(data, ChargeDetail.class);
		
		// 保存组套明细表信息
		model.setHosId(user.getHosId());
		ChargeDetail saved = chargeDetailManager.save(model);
		
		return ResultUtils.renderSuccessResult(saved);
	}
	
	/**
	 * 根据组套id取明细列表
	 * @param comboId
	 * @return
	 */
	@RequestMapping(value = "/items/list/{comboId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDetailList(@PathVariable("comboId") String comboId) {
		List<ChargeDetail> models = chargeDetailManager
				.find("from ChargeDetail where comboId = ? order by comboSort", comboId);
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 删除组套
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteGroup(@PathVariable("id") String id) {
		try {
			// 删除明细
			List<Object> values = new ArrayList<Object>();
			values.add(id);
			this.chargePkgManager.executeSql("delete from ITEM_GROUP_DETAIL where COMBO_ID = ? ", values.toArray());
			// 删除组套
			this.chargePkgManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除明细
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/item/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteItem(@PathVariable("id") String id) {
		try {
			ChargeDetail toDel = this.chargeDetailManager.get(id);
			// 更改排序
			List<Object> values = new ArrayList<Object>();
			values.add(toDel.getComboId());
			values.add(toDel.getComboSort());
			this.chargeDetailManager.executeSql("update ITEM_GROUP_DETAIL set COMBO_SORT = COMBO_SORT - 1 where COMBO_ID = ? and COMBO_SORT > ? ", values.toArray());
			
			this.chargeDetailManager.delete(id);
			
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 明细成组
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/item/makeGruop", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result makeGroup(@RequestParam(value = "data", defaultValue = "") String data) {
		List ids =  JSONUtils.deserialize(data, List.class);
		// 取自增组合号
		int comboNo = redisSequenceManager.getSeq("ITEM_GROUP_DETAIL", "COMBO_NO").getSeq().intValue();
		StringBuffer jql = new StringBuffer("update ITEM_GROUP_DETAIL set COMBO_NO = ? where ID in ( ");
		List<Object> values = new ArrayList<Object>();
		values.add(comboNo);
		for(int i = 0; i < ids.size(); i++){
			jql.append("?");
			values.add(ids.get(i).toString());
			if(i != ids.size() - 1) jql.append(",");
		}
		jql.append(")");
		this.chargeDetailManager.executeSql(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 从组合中删除
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/item/deleteFromGroup", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result deleteFromGroup(@RequestParam(value = "data", defaultValue = "") String data) {
		List ids =  JSONUtils.deserialize(data, List.class);
		
		StringBuffer jql = new StringBuffer("update ITEM_GROUP_DETAIL set COMBO_NO = ? where ID in ( ");
		List<Object> values = new ArrayList<Object>();
		values.add(null);
		for(int i = 0; i < ids.size(); i++){
			jql.append("?");
			values.add(ids.get(i).toString());
			if(i != ids.size() - 1) jql.append(",");
		}
		jql.append(")");
		this.chargeDetailManager.executeSql(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 明细排序
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/item/sort", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result sortItems(@RequestParam(value = "data", defaultValue = "") String data) {
		List ids =  JSONUtils.deserialize(data, List.class);
		
		StringBuffer jql = new StringBuffer("update ITEM_GROUP_DETAIL set COMBO_SORT = ? where ID = ? ");
		for(int i = 0; i < ids.size(); i++){
			List<Object> values = new ArrayList<Object>();
			values.add(i + 1);
			values.add(ids.get(i).toString());
			this.chargeDetailManager.executeSql(jql.toString(), values.toArray());
		}
		return ResultUtils.renderSuccessResult();
	}

}
