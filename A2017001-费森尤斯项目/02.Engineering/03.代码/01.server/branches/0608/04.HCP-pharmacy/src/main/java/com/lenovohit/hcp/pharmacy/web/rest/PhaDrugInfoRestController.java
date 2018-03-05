package com.lenovohit.hcp.pharmacy.web.rest;

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
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;

@RestController
@RequestMapping("/hcp/pharmacy/settings/medicineMng")
public class PhaDrugInfoRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;
	@Autowired
	private GenericManager<Company, String> phaCompanyInfoManager;

	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		PhaDrugInfo query = JSONUtils.deserialize(data, PhaDrugInfo.class);
		StringBuilder jql = new StringBuilder("from PhaDrugInfo where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(query.getCommonSpell())) {
			jql.append("and commonSpell like ? ");
			values.add("%" + query.getCommonSpell() + "%");
		}
		if (!StringUtils.isEmpty(query.getCommonWb())) {
			jql.append("and commonWb like ? ");
			values.add("%" + query.getCommonWb() + "%");
		}
		if (!StringUtils.isEmpty(query.getDrugType())) {
			jql.append("and drugType like ? ");
			values.add("%" + query.getDrugType() + "%");
		}
		if (!StringUtils.isEmpty(query.getCommonName())) {
			jql.append("and (commonName like ? or commonSpell like ? or commonWb like ? or barCode = ? )");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName() + "%");
			values.add(query.getCommonName());
		}
		if (!StringUtils.isEmpty(query.getTradeName())) {
			jql.append("and (tradeName like ? or tradeSpell like ? or tradeWb like ? or barCode = ? )");
			values.add("%" + query.getTradeName() + "%");
			values.add("%" + query.getTradeName() + "%");
			values.add("%" + query.getTradeName() + "%");
			values.add(query.getTradeName());
		}
		if (StringUtils.isNotBlank(query.getDrugCode())) {
			jql.append("and drugCode = ? ");
			values.add(query.getDrugCode());
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaDrugInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		PhaDrugInfo model = phaDrugInfoManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<PhaDrugInfo> models = phaDrugInfoManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreateMenu(@RequestBody String data) {
		PhaDrugInfo model = JSONUtils.deserialize(data, PhaDrugInfo.class);
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setCreateOper(user.getName());
		model.setCreateTime(now);
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		model.setCompanyInfo(phaCompanyInfoManager.get(model.getProducer()));
		model.setDoseUnit(StringUtils.isBlank(getDictNameByKey("DOSE_UNIT", model.getDoseUnit())) ? model.getDoseUnit()
				: getDictNameByKey("DOSE_UNIT", model.getDoseUnit()));
		model.setMiniUnit(StringUtils.isBlank(getDictNameByKey("MINI_UNIT", model.getMiniUnit())) ? model.getMiniUnit()
				: getDictNameByKey("MINI_UNIT", model.getMiniUnit()));
		model.setPackUnit(StringUtils.isBlank(getDictNameByKey("PACK_UNIT", model.getPackUnit())) ? model.getPackUnit()
				: getDictNameByKey("PACK_UNIT", model.getPackUnit()));
		model.setCommonSpell(PinyinUtil.getFirstSpell(model.getCommonName()));
		model.setCommonWb(WubiUtil.getWBCode(model.getCommonName()));
		model.setTradeSpell(PinyinUtil.getFirstSpell(model.getTradeName()));
		model.setTradeWb(WubiUtil.getWBCode(model.getTradeName()));
		model.setDrugSpecs(model.getBaseDose() + model.getDoseUnit() + "*" + model.getPackQty() + model.getMiniUnit()
				+ "/" + model.getPackUnit());
		// TODO 校验
		PhaDrugInfo saved = this.phaDrugInfoManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	private String getDictNameByKey(String columnName, String key) {
		String hql = "from Dictionary where columnName = ? and columnKey = ? ";
		List<Dictionary> result = dictionaryManager.find(hql, columnName, key);
		if (result.size() > 0)
			return result.get(0).getColumnVal();
		return null;
	}

	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		PhaDrugInfo model = JSONUtils.deserialize(data, PhaDrugInfo.class);
		if (model == null || StringUtils.isBlank(model.getProducer())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setCompanyInfo(phaCompanyInfoManager.get(model.getProducer()));
		model.setUpdateTime(now);
		model.setDoseUnit(StringUtils.isBlank(getDictNameByKey("DOSE_UNIT", model.getDoseUnit())) ? model.getDoseUnit()
				: getDictNameByKey("DOSE_UNIT", model.getDoseUnit()));
		model.setMiniUnit(StringUtils.isBlank(getDictNameByKey("MINI_UNIT", model.getMiniUnit())) ? model.getMiniUnit()
				: getDictNameByKey("MINI_UNIT", model.getMiniUnit()));
		model.setPackUnit(StringUtils.isBlank(getDictNameByKey("PACK_UNIT", model.getPackUnit())) ? model.getPackUnit()
				: getDictNameByKey("PACK_UNIT", model.getPackUnit()));
		model.setCommonSpell(PinyinUtil.getFirstSpell(model.getCommonName()));
		model.setCommonWb(WubiUtil.getWBCode(model.getCommonName()));
		model.setTradeSpell(PinyinUtil.getFirstSpell(model.getTradeName()));
		model.setTradeWb(WubiUtil.getWBCode(model.getTradeName()));
		this.phaDrugInfoManager.save(model);
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id) {
		try {
			this.phaDrugInfoManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 删除多项
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/removeAll", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM PHA_DRUGINFO WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.phaDrugInfoManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
}
