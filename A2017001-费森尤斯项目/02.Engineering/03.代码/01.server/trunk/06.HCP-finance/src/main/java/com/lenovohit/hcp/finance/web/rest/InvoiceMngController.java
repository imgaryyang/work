package com.lenovohit.hcp.finance.web.rest;

import java.math.BigInteger;
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
import com.lenovohit.hcp.finance.model.InvoiceManage;

@RestController
@RequestMapping("/hcp/finance/invoiceMng/")
public class InvoiceMngController extends HcpBaseRestController {
	@Autowired
	private GenericManager<InvoiceManage, String> invoiceManageManager;

	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		InvoiceManage model = JSONUtils.deserialize(data, InvoiceManage.class);
		InvoiceManage saved = null;
		try {
			checkInvoiceInfo(model);
			buildModel(model);
			updateOtherStop(model.getHosId(), model.getInvoiceType(), model.getGetOper());
			saved = this.invoiceManageManager.save(model);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		try {
			this.invoiceManageManager.delete(id);
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
			idSql.append("DELETE FROM FM_INVOICE_MANAGE WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.invoiceManageManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		InvoiceManage model = JSONUtils.deserialize(data, InvoiceManage.class);
		InvoiceManage manage = invoiceManageManager.get(model.getId());
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		if (model.getInvoiceUse().compareTo(model.getInvoiceEnd()) > 0
				|| model.getInvoiceUse().compareTo(model.getInvoiceStart()) < 0)
			return ResultUtils.renderFailureResult("使用中的发票号必须在发票区间内");
		updateOtherStop(manage.getHosId(), manage.getInvoiceType(), manage.getGetOper());
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		manage.setUpdateOper(user.getName());
		manage.setUpdateOperId(user.getId());
		manage.setInvoiceUse(model.getInvoiceUse());
		manage.setUpdateTime(now);
		manage.setInvoiceState(InvoiceManage.INVOICE_STATE_USE);
		this.invoiceManageManager.save(manage);
		return ResultUtils.renderSuccessResult();
	}

	private void updateOtherStop(String hosId, String invoiceType, String getOper) {
		// 同一类型、同一操作员。只能有一条记录正在使用
		String hql = "from InvoiceManage where invoiceType = ? and getOper = ? and hosId = ? ";
		List<InvoiceManage> result = invoiceManageManager.find(hql, invoiceType, getOper, hosId);
		for (InvoiceManage invoiceManage : result) {
			invoiceManage.setInvoiceState(InvoiceManage.INVOICE_STATE_STOP);
		}
		this.invoiceManageManager.batchSave(result);
	}

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		InvoiceManage query = JSONUtils.deserialize(data, InvoiceManage.class);
		StringBuilder jql = new StringBuilder("from  InvoiceManage where 1=1 ");
		// TODO 查询条件
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());
		
		if (StringUtils.isNotBlank(query.getInvoiceType())) {
			jql.append("and invoiceType = ? ");
			values.add(query.getInvoiceType());
		}
		if (StringUtils.isNotBlank(query.getGetOper())) {
			jql.append("and getOper like ? ");
			values.add(query.getGetOper());
		}
		if (StringUtils.isNotBlank(query.getInvoiceNo())) {
			jql.append("and invoiceStart < ? ");
			values.add(query.getInvoiceNo());
		}
		if (StringUtils.isNotBlank(query.getInvoiceNo())) {
			jql.append("and invoiceEnd > ? ");
			values.add(query.getInvoiceNo());
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		invoiceManageManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/invoiceAdjust/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAdjustPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		InvoiceManage query = JSONUtils.deserialize(data, InvoiceManage.class);
		query.setGetOper(this.getCurrentUser().getName());
		StringBuilder jql = new StringBuilder("from  InvoiceManage where 1=1 ");
		// TODO 查询条件
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());
		
		if (StringUtils.isNotBlank(query.getInvoiceType())) {
			jql.append("and invoiceType = ? ");
			values.add(query.getInvoiceType());
		}
		if (StringUtils.isNotBlank(query.getGetOper())) {
			jql.append("and getOper like ? ");
			values.add(query.getGetOper());
		}
		if (StringUtils.isNotBlank(query.getInvoiceStart())) {
			jql.append("and invoiceStart >= ? ");
			values.add(query.getInvoiceStart());
		}
		if (StringUtils.isNotBlank(query.getInvoiceEnd())) {
			jql.append("and invoiceEnd <= ? ");
			values.add(query.getInvoiceEnd());
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		invoiceManageManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		InvoiceManage model = invoiceManageManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<InvoiceManage> models = invoiceManageManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	private void checkInvoiceInfo(InvoiceManage info) {
		BigInteger integer = new BigInteger("0");
		if (info.getInvoiceStart().compareTo(info.getInvoiceEnd()) > 0)
			throw new RuntimeException("发票起始号不能大于结束号");
		if (integer.equals(info.getInvoiceStart()) || integer.equals(info.getInvoiceEnd()))
			throw new RuntimeException("发票起始号或结束号不能为0");
		if (StringUtils.isBlank(info.getInvoiceType()))
			throw new RuntimeException("发票分类不能为空");
		if (StringUtils.isBlank(info.getGetOper()))
			throw new RuntimeException("领用人不能为空");
		if (StringUtils.isBlank(info.getInvoiceStart()))
			throw new RuntimeException("发票起始号不能为空");
		if (StringUtils.isBlank(info.getInvoiceEnd()))
			throw new RuntimeException("发票结束号不能为空");
	}

	private void buildModel(InvoiceManage model) {
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setHosId(user.getHosId());
		model.setInvoiceUse(model.getInvoiceStart());
		model.setCreateOper(user.getName());
		model.setGetTime(new Date());
		model.setCreateTime(now);
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		model.setIsshare(false);
		model.setInvoiceState(true);
	}

	/**    
	 * 功能描述：查找当前登录人正在使用的的票据
	 *@param data
	 *@return       
	 *@author gw
	 *@date 2017年4月3日             
	*/
	@RequestMapping(value = "/findCurrentInvoice", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result findCurrentInvoice(@RequestParam(value = "data", defaultValue = "") String data) {
		HcpUser user = this.getCurrentUser();
		InvoiceManage query = JSONUtils.deserialize(data, InvoiceManage.class);
		query.setGetOper(this.getCurrentUser().getName());
		StringBuilder jql = new StringBuilder("from  InvoiceManage where 1=1 AND invoiceState = '1' ");
		// TODO 查询条件
		List<Object> values = new ArrayList<Object>();
		if (StringUtils.isNotBlank(query.getInvoiceType())) {
			jql.append("and invoiceType = ? ");
			values.add(query.getInvoiceType());
		}
		if (StringUtils.isNotBlank(user.getName())) {// 领用人为当前登录人
			jql.append(" and getOper = ? ");
			values.add(user.getName());
		}
		InvoiceManage models = invoiceManageManager.findOne(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
}
