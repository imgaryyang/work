package com.lenovohit.hcp.material.web.rest;

import java.math.BigDecimal;
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
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.material.manager.MatBuyBillManager;
import com.lenovohit.hcp.material.manager.impl.MatStoreManagerImpl;
import com.lenovohit.hcp.material.model.MatBuyBill;
import com.lenovohit.hcp.material.model.MatBuyDetail;
import com.lenovohit.hcp.material.model.MatInfo;
import com.lenovohit.hcp.material.model.MatInputInfo;

@RestController
@RequestMapping("/hcp/material/buyBill")
public class MatBuyBillRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<MatBuyBill, String> matBuyBillManager;
	@Autowired
	private GenericManager<MatBuyDetail, String> matBuyDetailManager;
	@Autowired
	private MatBuyBillManager matBillManager;
	@Autowired
	private MatStoreManagerImpl matOutputInfoManager;// add by jiangyong

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
		MatBuyBill query = JSONUtils.deserialize(data, MatBuyBill.class);
		StringBuilder jql = new StringBuilder("from MatBuyBill where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println("forPage" + data);

		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());

		if (!StringUtils.isEmpty(query.getCreateOper())) {
			jql.append("and createOper = ? ");
			values.add(query.getCreateOper());
		}

		if (!StringUtils.isEmpty(query.getBuyBill())) {
			jql.append("and buyBill like ? ");
			values.add("%" + query.getBuyBill() + "%");
		}

		if (!StringUtils.isEmpty(query.getBuyState())) {
			jql.append("and buyState = ? ");
			values.add(query.getBuyState());
		}
		if (!StringUtils.isEmpty(query.getDeptId())) {
			jql.append("and deptId = ? ");
			values.add(query.getDeptId());
		}
		jql.append(" order by createTime desc ");

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		matBuyBillManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	/**
	 * 查询单项
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		MatBuyBill model = matBuyBillManager.get(id);
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
		MatBuyBill query = JSONUtils.deserialize(data, MatBuyBill.class);
		StringBuilder jql = new StringBuilder(" from MatBuyBill where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(data);
		if (StringUtils.isNotEmpty(query.getHosId())) {
			jql.append(" And hosId = ?");
			values.add(query.getHosId());
		}
		if (StringUtils.isNotEmpty(query.getCreateOper())) {
			jql.append(" And createOper = ?");
			values.add(query.getCreateOper());
		}
		if (StringUtils.isNotEmpty(query.getCreateOperId())) {
			jql.append(" And createOperId = ?");
			values.add(query.getCreateOperId());
		}
		if (StringUtils.isNotEmpty(query.getBuyState())) {
			jql.append(" And buyState = ?");
			values.add(query.getBuyState());
		}
		if (StringUtils.isNotEmpty(query.getDeptId())) {
			jql.append(" And deptId = ?");
			values.add(query.getDeptId());
		}

		List<MatBuyBill> models = matBuyBillManager.find(jql.toString(), values.toArray());

		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 查询company信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/load", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forLoadCompanyInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		MatBuyBill query = JSONUtils.deserialize(data, MatBuyBill.class);
		StringBuilder jql = new StringBuilder(
				"select c.companyName from MatBuyBill b,MatCompanyInfo c where c.id = b.company ");

		List<Object> values = new ArrayList<Object>();
		System.out.println(data);
		if (!StringUtils.isEmpty(query.getBuyBill())) {
			jql.append(" And b.buyBill = ?");
			values.add(query.getBuyBill());
		}

		List<MatBuyBill> models = matBuyBillManager.find(jql.toString(), values.toArray());

		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 新建
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreate(@RequestBody String data) {
		System.out.println(data);
		MatBuyBill phaBuyBill = (MatBuyBill) JSONUtils.deserialize(data, MatBuyBill.class);
		HcpUser user = this.getCurrentUser();
		try {
			matBillManager.createBuyBill(phaBuyBill, user);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 更新
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		MatBuyBill model = JSONUtils.deserialize(data, MatBuyBill.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		this.matBuyBillManager.save(model);
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 删除单项
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id) {
		System.out.println(id);
		if (StringUtils.isEmpty(id)) {
			return ResultUtils.renderFailureResult("采购单ID不允许为空！");
		}
		try {
			this.matBuyBillManager.delete(id);
			String sql = new String(" delete from pha_buydetail where bill_id = ? ");
			List<Object> values = new ArrayList<Object>();
			values.add(id);
			this.matBuyDetailManager.executeSql(sql, values.toArray());
		} catch (Exception e) {
			e.printStackTrace();
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
	@RequestMapping(value = "/removeAll", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM PHA_COMPANYINFO WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.matBuyBillManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 入库更新
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/updateInstock", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forInstock(@RequestBody String data) {
		MatBuyBill model = JSONUtils.deserialize(data, MatBuyBill.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		MatBuyBill newModel = this.matBuyBillManager.get(model.getId());
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		if (newModel.getBuyState().equals("1") && model.getBuyState().equals("2")) {
			newModel.setAuitdOper(user.getName());
			newModel.setAuitdTime(now);
		}
		if (!StringUtils.isEmpty(model.getBuyCost())) {
			newModel.setBuyCost(model.getBuyCost());
		}
		newModel.setUpdateOper(user.getName());
		newModel.setUpdateTime(now);
		newModel.setBuyState(model.getBuyState());
		this.matBuyBillManager.save(newModel);
		return ResultUtils.renderSuccessResult(newModel);
	}

	/**
	 * 采购计划审批，驳回，状态更行
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/updateBackInstock", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forBackInstock(@RequestBody String data) {
		MatBuyBill model = JSONUtils.deserialize(data, MatBuyBill.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		MatBuyBill newModel = this.matBuyBillManager.get(model.getId());
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		if (newModel.getBuyState().equals("1") && model.getBuyState().equals("3")) {
			newModel.setBuyState(model.getBuyState());
		}

		newModel.setUpdateOper(user.getName());
		newModel.setUpdateTime(now);
		this.matBuyBillManager.save(newModel);
		return ResultUtils.renderSuccessResult(newModel);
	}

	/**
	 * 入库更新 add by jiangyong
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/matInstockCommit", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result instock(@RequestBody String data) {
		MatBuyBill model = JSONUtils.deserialize(data, MatBuyBill.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		MatBuyBill newModel = this.matBuyBillManager.get(model.getId());
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		if (newModel.getBuyState().equals("1") && model.getBuyState().equals("2")) {
			newModel.setAuitdOper(user.getName());
			newModel.setAuitdTime(now);
		}
		if (!StringUtils.isEmpty(model.getBuyCost())) {
			newModel.setBuyCost(model.getBuyCost());
		}
		newModel.setUpdateOper(user.getName());
		newModel.setUpdateTime(now);
		newModel.setBuyState(model.getBuyState());
		newModel.setCompany(model.getCompany());
		// add by jiangyong
		newModel.setBuyDetail(model.getBuyDetail());
		List<MatInputInfo> _matInputInfoList = new ArrayList<>();
		matOutputInfoManager.matInputByBill(newModel,_matInputInfoList, user);
		return ResultUtils.renderSuccessResult(newModel);
	}
}
