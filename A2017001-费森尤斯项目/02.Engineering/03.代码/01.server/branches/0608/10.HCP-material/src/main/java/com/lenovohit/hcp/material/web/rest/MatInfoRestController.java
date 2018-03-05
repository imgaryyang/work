package com.lenovohit.hcp.material.web.rest;

import java.util.ArrayList;
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
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.material.model.MatInfo;

@RestController
@RequestMapping("/hcp/material/settings/materialInfo")
public class MatInfoRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<MatInfo, String> matInfoManager;

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
		MatInfo query = JSONUtils.deserialize(data, MatInfo.class);
		StringBuilder jql = new StringBuilder("from MatInfo where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(query.getCommonSpell())) {
			jql.append("and commonSpell like ? ");
			values.add("%" + query.getCommonSpell() + "%");
		}
		if (!StringUtils.isEmpty(query.getCommonWb())) {
			jql.append("and commonWb like ? ");
			values.add("%" + query.getCommonWb() + "%");
		}
		if (!StringUtils.isEmpty(query.getMaterialType())) {
			jql.append("and materialType = ? ");
			values.add(query.getMaterialType());
		}
		if (!StringUtils.isEmpty(query.getCommonName())) {
			jql.append("and (commonName like ? or commonSpell like ? or commonWb like ? or alias like ? or aliasSpell like ? or aliasWb like ? or barcode = ? )");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add("%" + query.getCommonName().toUpperCase() + "%");
			values.add(query.getCommonName());
		}
		if (StringUtils.isNotBlank(query.getMaterialCode())) {
			jql.append("and materialCode = ? ");
			values.add(query.getMaterialCode());
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		matInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		MatInfo model = matInfoManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<MatInfo> models = matInfoManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 保存
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@RequestBody String data) {
		MatInfo model = JSONUtils.deserialize(data, MatInfo.class);
		// 设置厂商
		Company company = new Company();
		company.setId(model.getProducer());
		model.setCompanyInfo(company);
		// 设置通用名拼音码和五笔码
		if (!StringUtils.isEmpty(model.getCommonName()) && StringUtils.isEmpty(model.getCommonSpell()))
			model.setCommonSpell(PinyinUtil.getFirstSpell(model.getCommonName()));
		if (!StringUtils.isEmpty(model.getCommonName()) && StringUtils.isEmpty(model.getCommonWb()))
			model.setCommonWb(WubiUtil.getWBCode(model.getCommonName()));
		// 设置别名拼音码和五笔码
		if (!StringUtils.isEmpty(model.getAlias()) && StringUtils.isEmpty(model.getAliasSpell()))
			model.setAliasSpell(PinyinUtil.getFirstSpell(model.getAlias()));
		if (!StringUtils.isEmpty(model.getAlias()) && StringUtils.isEmpty(model.getAliasWb()))
			model.setAliasWb(WubiUtil.getWBCode(model.getAlias()));
		
		// TODO 校验
		MatInfo saved = this.matInfoManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id) {
		try {
			this.matInfoManager.delete(id);
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
	public Result forRemoveSelected(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM MATERIAL_INFO WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.matInfoManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
}
